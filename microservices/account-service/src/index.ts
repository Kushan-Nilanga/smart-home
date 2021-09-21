import os from "os";
import cors from "cors";
import axios from "axios";
import express from "express";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

const data_service =
  "http://localhost:4000/graphql" || process.env.DATA_SERVICE;
const secret = "mysecret";

class User {
  email: String;
  pass: String;
  token: String = "";
  constructor(userdata: any) {
    if (userdata.email === undefined || userdata.pass === undefined)
      throw new Error("undefined username or password");
    this.pass = userdata.pass;
    this.email = userdata.email;
  }
}

const port = process.env.PORT || 3000;
// const secret = process.env.SECRET || "secret";

var app = express();
app.use(bodyParser.json());
app.use(cors());

// Signin endpoint
app.post("/signin", async (req, res) => {
  try {
    const newUser = new User(req.body);
    axios
      .post(data_service, {
        query: `
				mutation{
					createUser(email:"${newUser.email}", pass:"${newUser.pass}"){
						email
					}
				}
			`,
      })
      .then((result) => {
        return res.send("Sign in complete");
      });
  } catch (e) {
    return res.send("Error signing the user");
  }
});

// Login endpoint
app.post("/login", (req, res) => {
  try {
    const findUser = new User(req.body);
    axios
      .post(data_service, {
        query: `
			query	{
				user(email:"${findUser.email}", pass:"${findUser.pass}") {
					id
					email
				}
			}
			`,
      })
      .then((result) => {
        const token = jwt.sign({ data: result.data, logged: true }, secret);
        return res.send(token);
      });
  } catch (e) {
    return res.send("error logging in");
  }
});

// verify user tokens
app.post("/verify", (req, res) => {
  if (req.body.token === undefined) return res.status(400).send("no token");
  jwt.verify(req.body.token, secret, (err: any, decoded: any) => {
    if (err) return res.status(400).send("cannot verify token");
    if (decoded !== undefined) return res.send(decoded);
    return res.status(400).send("token error");
  });
});

// Default endpoint
// define a route handler for the default home page
app.get("/", (req, res) => {
  // render the index template
  res.send("👥 account service active, host: " + os.hostname());
});

// start the express server
app.listen(port, () => {
  console.log(`accounts service started at http://127.0.0.1:${port}`);
});
