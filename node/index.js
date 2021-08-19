require('dotenv').config()
const app = require("express")();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO
const secret = process.env.SECRET
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./model/user');
const jwt = require('jsonwebtoken');

// connecting to mongo db
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", function (req, res) { res.send("Hello there") });

// some actions need user auth token
app.route("/user")
	// handling post a new user requests
	.post(function (req, res) {
		if (!req.headers.username || !req.headers.password || !req.headers.email) { res.status(400).send("Incomplete user data"); return; }
		User.find({ email: req.headers.email }).then((q) => {
			if (q.length > 0) {
				res.status(400).send("user exists");
				return;
			} else {
				const hexpw = req.headers.password;
				//const hexpw = crypto.createHash('sha256').update(req.headers.password).digest("hex")
				const newUser = new User({ name: req.headers.username, pass: hexpw, email: req.headers.email })
				newUser.save().then((user) => {
					const token = generateToken({ id: user._id, type: "user" })
					res.send(token);
				});

			}
		});
	})
	// handling get auth token request
	.get(function (req, res) {
		if (!req.headers.password || !req.headers.email) { res.status(400).send("Incomplete user data"); return; }
		const hexpw = req.headers.password;
		//const hexpw = crypto.createHash('sha256').update(req.headers.password).digest("hex");
		User.find({ email: req.headers.email, pass: hexpw }).then((q) => {
			if (q.length === 1) {
				const token = generateToken({ id: q[0]._id, type: "user" })
				res.send(token);
				return;
			} else {
				res.status(400).send("Authentication error");
				return;
			}
		});
	})

// user auth tokens needed to perform these actions
app.route("/device")
	.all((req, res, next) => {
		if (!req.headers.token) { res.status(400).send("no access token"); return }
		jwt.verify(req.headers.token, secret, function (error, decoded) {
			if (error) { res.status(400).send("invalid token"); return }
			res.token_type = decoded.type
			res.token_id = decoded.id
			next();
		});

	})

	.post(function (req, res) {
		if (res.token_type !== "user") { res.send("not authenticated as user"); return; }
		if (!req.headers.ssid) { res.send("no ssid defined"); return; }
		if (!req.headers.name) { res.send("no name defined"); return; }
		User.updateOne({ _id: res.token_id }, { $push: { devices: { ssid: req.headers.ssid, name: req.headers.name } } }).then(
			function (success) {
				console.log(success)
				const device_token = generateToken({ user_id: res.token_id, ssid: req.headers.ssid })
				res.send(device_token);
			}
		)
	})

	.get(function (req, res) {
		if (res.token_type !== "user") { res.send("invalid token type"); return }
		User.findOne({ _id: res.token_id }).then(function (data) {
			res.send({ res: data });
		})
	})

	.delete(function (req, res) {
		if (!req.headers.device) { res.send("device not specified"); return }
		User.findOneAndUpdate({ _id: res.token_id }, { $pull: { devices: { _id: req.headers.device } } }).then(
			function (err) {
				res.send("device removed");
			}
		)
	})

// sensor auth token needed to perform these actions
app.route("/data")
	.all(function (req, res, next) {
		const token_data = jwt.verify(req.headers.token, secret)
		console.log(token_data)
		res.user = token_data.user_id
		res.ssid = token_data.ssid
		next();
	})

	.post(function (req, res) {
		User.updateOne(
			{ _id: res.user },
			{ $push: { 'devices.$[outer].data': { time: req.headers.time, status: req.headers.status } } },
			{ arrayFilters: [{ 'outer.ssid': res.ssid }] })
			.then(function (data) {
			})
		res.send("Device data posted");
	})

var i = 0;
app.all("/*", (req, res, next) => {
	console.log(i++);
	next();
})

app.listen(port, function (req, res) {
	console.log(`app running at http://localhost:${port}`);
});

// generating access token 
function generateToken(data) {
	return jwt.sign(data, secret)
}