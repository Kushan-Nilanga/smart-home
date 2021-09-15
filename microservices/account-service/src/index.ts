import express from "express";
import os from "os";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// User Schema Definition
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        email: "string",
        pass: "string",
    })
);

// Environment vars
const port = process.env.PORT || 3000;
const mongo =
    process.env.MONGO ||
    "mongodb+srv://root:toor@sit314.g7vp8.mongodb.net/test?retryWrites=true&w=majority";
const secret = process.env.SECRET || "secret";

var app = express();
mongoose.connect(mongo);

// Signin endpoint
app.post("/signin", async (req, res) => {
    if (req.headers.pass === undefined)
        return res.status(400).send("no password");

    if (req.headers.email === undefined)
        return res.status(400).send("no email");

    User.findOne({ email: req.headers.email }, (err: any, found: any) => {
        if (found) return res.status(400).send("user exists");

        const newUser = new User({
            email: req.headers.email,
            pass: req.headers.pass,
        });

        newUser.save((err) => {
            if (err) {
                return res.status(400).send("error saving");
            }
            return res.status(200).send("user saved successfully");
        });
    });
});

// Login endpoint
app.get("/login", (req, res) => {
    if (req.headers.pass === undefined)
        return res.status(400).send("no password");

    if (req.headers.email === undefined)
        return res.status(400).send("no email");

    User.findOne({ email: req.headers.email }, (err: any, found: any) => {
        if (!found) return res.status(400).send("couldn't log in");
        return res.send(jwt.sign({ userID: found._id.toString() }, secret));
    });
});

// verify user tokens
app.get("/verify", (req, res) => {
    if (req.headers.token === undefined)
        return res.status(400).send("no token");

    jwt.verify(req.headers.token.toString(), secret, (err, decoded) => {
        if (decoded === undefined || decoded.userID === undefined)
            return res.status(400).send("token verification unsuccessful");

        User.findOne({ _id: decoded.userID }, (err: any, found: any) => {
            if (err) return res.status(400).send("user find error");
            if (!found) return res.status(400).send("permission denied");
            return res.status(200).send("authenticated");
        });
    });
});

// Default endpoint
// define a route handler for the default home page
app.get("/", (req, res) => {
    // render the index template
    res.send("user-service active, host: " + os.hostname());
});

// start the express server
app.listen(port, () => {
    console.log(`server started at http://127.0.0.1:${port}`);
});
