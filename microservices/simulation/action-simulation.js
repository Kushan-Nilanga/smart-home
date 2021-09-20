/**
 * TODO
 *
 * 1. Create User
 * 2. Login User
 * 3. Verification
 *
 * 4. Add light
 * 5. Change light
 * 6. Remove light
 */

const axios = require('axios').default;
axios.defaults.headers.common = { "Content-Type": "application/json" }

User: {
	email: String
	pass: String
	token: String
}

class ActionSimulation {
	_user_endpoint = ""
	_control_endpoint = ""
	_manager_endpoint = ""

	signin_user(email, pass) {
		axios.post(
			this._user_endpoint + "/signin", { email: email, pass: pass }
		).then((res) => {
			console.log(res.data);
		}).catch(err => {
			console.log(err.message);
		})
	}

	login_user(email, pass) {
		axios.post(
			this._user_endpoint + "/login", { email: email, pass: pass }
		).then((res) => {
			console.log(res.data)
		}).catch(err => {
			console.log(err.message);
		})
	}

	verify_user(token) {
		axios.post(
			this._user_endpoint + "/verify", { token: token }
		).then((res) => {
			console.log(res.data);
		}).catch(err => {
			console.log(err.message);
		})
	}


	light_status() { }

	add_light() { }
	remove_light() { }


	constructor(light_sim, dns) {
		this._user_endpoint = dns + ":3000"
		this._control_endpoint = dns + "/control"
		this._manager_endpoint = dns + "/manager"
	}
}

module.exports = { ActionSimulation }