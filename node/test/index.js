const axios = require('axios')
const crypto = require('crypto');
const faker = require('faker')

const host = "http://localhost:3000"

var users = {}

function user_create(username = "default", password = "SafeDefault", email = "default@default.com") {
    return axios.post(host + '/user', {}, {
        headers: {
            username: username,
            email: email,
            password: crypto.createHash('sha256').update(password).digest("hex")
        }
    }).then(function (res) {
        users[email] = { email: email, password: password, token: res.data, devices: {} };
    }).catch(error => { })
}

function user_login(password = "SafeDefault", email = "default@default.com") {
    return axios.get(host + '/user', {
        headers: {
            email: email,
            password: crypto.createHash('sha256').update(password).digest("hex")
        }
    }).then(function (res) {
        if (users[email] === undefined) {
            users[email] = { email: email, password: password, token: res.data, devices: {} }
        } else {
            users[email].token = res.data
        }
    }).catch(error => { })
}

function device_create(email, user_token, ssid = "uniquessid", name = "RoomLight") {
    return axios.post(host + '/device', {}, {
        headers: {
            token: user_token,
            ssid: ssid,
            name: name
        }
    }).then(function (res) {
        if (users[email].devices[ssid] === undefined) { users[email].devices[ssid] = res.data }
    }).catch(error => { console.log(error) })
}

function device_data(user_token) {
    return axios.get(host + '/device', {
        headers: {
            token: user_token
        }
    }).then(function (res) {
    }).catch(err => { })
}

function data_post(device_token, ssid, status) {
    return axios.post(host + '/data', {}, {
        headers: {
            token: device_token,
            ssid: ssid,
            time: new Date().toISOString(),
            status: status
        }
    }).then(function (res) {
    })
}


const frequency = {
    "USER_CREATE": 5,
    "USER_LOGIN": 10,
    "DEVICE_CREATE": 20,
    "DEVICE_DATA": 50
}

function random_occur(randomness, callback) {
    if (Math.floor(Math.random() * 100) <= randomness) {
        callback();
    }
}

function random_number(max) {
    return Math.floor(Math.random() * max)
}

function run_simulation() {
    if (Object.keys(users).length < 3) {
        random_occur(frequency["USER_CREATE"], () => {
            user_create(faker.name.findName(), faker.random.alphaNumeric(10), faker.internet.email());
        })
    }

    if (Object.keys(users).length > 0) {
        random_occur(frequency["USER_LOGIN"], () => {
            const userIdx = random_number(Object.keys(users).length)
            const userKey = Object.keys(users)[userIdx];
            user_login(userKey, users[userKey].password)
        })
    }

    if (Object.keys(users).length > 0) {
        random_occur(frequency['DEVICE_CREATE'], () => {
            const userIdx = random_number(Object.keys(users).length)
            const userKey = Object.keys(users)[userIdx]
            device_create(userKey, users[userKey].token, faker.random.alphaNumeric(5), faker.name.firstName()+"'s Room")
        })
    }

    if (Object.keys(users).length > 0)
        random_occur(frequency['DEVICE_DATA'], () => {
            const userIdx = random_number(Object.keys(users).length)
            const userKey = Object.keys(users)[userIdx]
            device_data(users[userKey].token)
        })

    if (Object.keys(users).length > 0) {
        for (const [key, value] of Object.entries(users)) {
            for (const [devkey, val] of Object.entries(value.devices)) {
                
                data_post(val, devkey, random_number(2))
            }
        }
    }

    console.log(users);
}

setInterval(run_simulation, 1000)

