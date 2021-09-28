import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const port = process.env.PORT || 3020;
const data_service =
  process.env.DATA_SERVICE || "http://data-service-asg-lb-1678460377.ap-southeast-2.elb.amazonaws.com/graphql";
const communication_service =
  process.env.COMMUNICATION_SERVICE || "http://communication-service-alb-2011332689.ap-southeast-2.elb.amazonaws.com";
const accounts_service = process.env.ACCOUNT_SERVICE || "http://account-service-alb-831679390.ap-southeast-2.elb.amazonaws.com";

/**
 * Functionality
 *	1. Send messages to turn 1 light on/off.
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
      .then(async (result) => {
        if (result.data.data.addData === "device id not found") {
          return res.status(400).send(result.data.data.addData);
        }
        const com_result = await axios.post(
          communication_service + "/status-update",
          status
        );
        return res.send({
          "data-service": result.status,
          "communication-service": com_result.status,
        });
      });
  } catch (err: any) {
    return res.status(400).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`control server 🎮 listening at http://localhost:${port}`);
});
