const mongoose = require("mongoose");

module.exports = mongoose.model("User", {
    name: String,
    pass: String,
    email: String,
    devices: [{
        ssid: String,
        name: String,
        data: [{
            time: String,
            status: String
        }]
    }]
})