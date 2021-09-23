import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const port = process.env.PORT || 3020;
const data_service =
  process.env.DATA_SERVICE || "http://localhost:4000/graphql";
const communication_service =
  process.env.COMMUNICATION_SERVICE || "http://localhost:3010";
const accounts_service = process.env.ACCOUNT_SERVICE || "http://localhost:3000";

/**
 * Functionality
 *	1. Send messages to turn 1 light on/off.
 * 	2. Send messages to turn batch of lights on/off.
 *  3. Health checks.
 */

// Abstract entity of Control State
class StatusUpdate {
  update: Date;
  status: string;
  health: string;
  id: string;

  constructor(dataObj: any) {
    this.update = new Date();
    if (dataObj.id === undefined) throw new Error("destination id missing");
    if (dataObj.status === undefined && dataObj.health === undefined)
      throw new Error("no status field");
    this.id = dataObj.id;
    this.status = dataObj.status;
    this.health = dataObj.health;
  }
}

//------------ Server Code ----------------
var app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("control server active 🎮");
});

// Light status updates
app.post("/status", async (req, res) => {
  if (req.headers.token === undefined) return res.status(400).send("no token");
  const result = await axios.post(accounts_service + "/verify", {
    token: req.headers.token,
  });
  req.headers.user_id = result.data.data.data.user.id;
  try {
    let status = await new StatusUpdate(req.body);
    axios
      .post(data_service, {
        query: `
				mutation{
					addData(
						user_id: "${req.headers.user_id}",
						device_id: "${status.id}",
						updated: "${status.update}",
						health: "${status.health}",
						state:  "${status.status}",
					)
				}
			`,
      })
      .then((result) => {
        axios.post(communication_service + "/status-update", status);
        return res.send(JSON.parse(result.data.data.addData));
      });
  } catch (err: any) {
    return res.status(400).send(err.message);
  }

  // TODO send control requests to communication server
});

app.listen(port, () => {
  console.log(`control server 🎮 listening at http://localhost:${port}`);
});

// TODO:
// get devices from devices service
// run health checks on random devices
// send those commands to communication server
// save state in devices
