import os from "os";
import mqtt from "mqtt";
import Filter from "./filter";
import express from "express";

const port = process.env.PORT || 3010;
const mqtt_url = process.env.MQTT || "mqtt://test.mosquitto.org";

var app = express();
app.use(express.json());

//----------------------------------------------------------------
// FILTER SECTION
const myFilterObj = new Filter("smartlight/id/type");

// listening on health updates
myFilterObj.addFilter(
  [
    { property: "type", comparison: "==", value: "health" },
    { property: "message", comparison: "==", value: "unhealthy" },
  ],
  (topic, message) => {
    console.log(topic, message);
  }
);

// listening on status updates
myFilterObj.addFilter(
  [
    { property: "type", comparison: "==", value: "status" },
    { property: "message", comparison: "==", value: "completed" },
  ],
  (topic, message) => {}
);
//----------------------------------------------------------------

//----------------------------------------------------------------
// MQTT SETUP
const client = mqtt.connect(mqtt_url).on("connect", () => {
  client.subscribe("smartlight/#");
});

client.on("message", (topic, message) => {
  //console.log(topic, message.toString());
  myFilterObj.filter(topic, message.toString());
});
//----------------------------------------------------------------

//----------------------------------------------------------------
// ENDPOINTS
// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("communication service active, host: " + os.hostname());
});

class StatusUpdate {
  update: Date;
  status: string;
  health: string;
  id: string;

  constructor(dataObj: any) {
    this.update = new Date();
    if (dataObj.id === undefined) throw new Error("destination id missing");
    if (dataObj.status === undefined && dataObj.health === undefined)
      throw new Error("no health or status fields");
    this.id = dataObj.id;
    this.status = dataObj.status;
    this.health = dataObj.health;
  }
}

// send status change to lights
app.post("/status-update", async (req, res) => {
  try {
    const update = new StatusUpdate(req.body);
    if (update.status === undefined) throw new Error("status undefined");
    client.publish(`smartlight/${update.id}/status/`, update.status);
    return res.status(200).send("request sent");
  } catch (e) {
    return res.status(400).send("status update error");
  }
});

// start the express server
app.listen(port, () => {
  console.log(`server started at http://127.0.0.1:${port}`);
});
//----------------------------------------------------------------
