import cors from "cors";
import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const port = process.env.PORT || 3040;
const accounts_service = process.env.ACCOUNT_SERVICE || "http://localhost:3000";
const data_service =
  process.env.DATA_SERVICE || "http://localhost:4000/graphql";
const app = express();
app.use(cors());
app.use(express.json());

class Device {
  id: string = "";
  uuid: string = "";
  constructor(device: any) {
    if (device.uuid === undefined && device.id === undefined) {
      throw new Error("uuid missing");
    }
    this.uuid = device.uuid;
    this.id = device.id;
  }
}

app.use("/", async (req, res, next) => {
  if (req.originalUrl === "/") {
    return next();
  }
  try {
    if (req.headers.token === undefined)
      return res.status(400).send("no token");
    const result = await axios.post(accounts_service + "/verify", {
      token: req.headers.token,
    });
    req.headers.user_id = result.data.data.data.user.id;
    if (result.data.logged !== true) {
      return res.status(400).send("not logged in");
    }
  } catch (e) {
    return res.status(400).send("token error");
  }
  return next();
});

app.get("/devices", (req, res) => {
  axios
    .post(data_service, {
      query: `
			query	{
				userid(user_id:"${req.headers.user_id}") {
					id
					devices{
						_id
						uuid
						state{
							updated
							health
							state
						}
					}
				}
			}
			`,
    })
    .then((result) => {
      res.status(200).send(result.data);
    });
});

app.post("/create", (req, res) => {
  try {
    const newDevice = new Device(req.body);
    axios
      .post(data_service, {
        query: `
			mutation	{
				createDevice(user_id:"${req.headers.user_id}", uuid:"${newDevice.uuid}") 
			}
			`,
      })
      .then((result) => {
        console.log(result.data);
      });
  } catch (e) {
    return res.status(400).send("data error");
  }
  return res.status(200).send("device added successfully");
});

app.post("/remove", async (req, res) => {
  try {
    if (req.body.device_id === undefined) throw new Error();
  } catch (e) {
    return res.status(400).send("data error");
  } finally {
    return await axios
      .post(data_service, {
        query: `
			mutation	{
				removeDevice(user_id:"${req.headers.user_id}", device_id:"${req.body.device_id}") 
			}
			`,
      })
      .then((result) => {
        return res.status(200).send(result.data);
      })
      .catch((e) => {
        throw new Error("request error");
        return res.status(400).send("request error");
      });
  }
});

app.get("/", (_, res) => {
  res.send("👨‍💼 Light manager server online");
});

app.listen(port, () => {
  console.log("manager server listening at http://localhost:" + port);
});
