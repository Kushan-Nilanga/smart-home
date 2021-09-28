import axios from "axios";
import mqtt from "mqtt";
import express from "express";

const port = process.env.PORT || 3000;
const data_service =
  process.env.DATA_SERVICE ||
  "http://data-service-asg-lb-1678460377.ap-southeast-2.elb.amazonaws.com/graphql";
const mqtt_url = process.env.MQTT || "mqtt://test.mosquitto.org";
const fetch_interval = process.env.FETCH_INT || 5;
const check_interval = process.env.CHECK_INT || 1;

//----------------------------------------------------------------
// GET DEVICES
var devices: Array<any> = [];

getDevices();

// getting all the devices from the database
setInterval(() => {
  getDevices();
}, Number(fetch_interval) * 60 * 1000); // 2 mins

function getDevices() {
  console.log("get devices");
  axios
    .post(data_service, {
      query: `query {
			deviceids{
				_id
			}
		}`,
    })
    .then((result: any) => {
      devices = result.data.data.deviceids;
      last = new Map();
    });
}

//----------------------------------------------------------------
// HEALTH CHECKS
// last state
var last: Map<String, String> = new Map();

// checking health of all the devices
setInterval(() => {
  console.log("batch health check");

  // sending check health state to all the devices
  devices.forEach((device) => {
    // if any device without response is not in the unhealthy list
    // inform and add to the unhealthy list
    const data = last.get(device._id);
    if (data !== undefined) {
      const parsed = JSON.parse(data.toString());
      if (parsed.state === "request" && unhealthy.indexOf(device._id) === -1) {
        unhealthy.push(device._id);
        axios.post(data_service, {
          query: `
					mutation{
						addHealth(device_id: "${device._id}", health: "unhealthy")
					}
					`,
        });
      }
    }

    // check health
    healthCheck(device._id);
  });
}, Number(check_interval) * 60 * 1000); // 30s

function healthCheck(deviceid: string) {
  // send mqtt requesting for health
  client.publish(`smartlight/${deviceid}/health/`, "request");

  const data = last.get(deviceid);
  if (data !== undefined) {
    const parsed = JSON.parse(data.toString());
    if (parsed.state !== "request") {
      last.set(
        deviceid,
        JSON.stringify({ state: "request", time: new Date().getTime() })
      );
      unhealthy = unhealthy.filter((val: any, i, arr) => {
        return val !== deviceid;
      });
    }
  }
}

var unhealthy: Array<string> = [];

//----------------------------------------------------------------
// MQTT SETUP
const client = mqtt.connect(mqtt_url).on("connect", () => {
  client.subscribe("smartlight/+/health/");
});

client.on("message", (topic, msg) => {
  const splits = topic.split("/");
  const state = JSON.stringify({
    state: msg.toString(),
    time: new Date().getTime(),
  });
  last.set(splits[1], state);
});

var app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("health check server active");
});

app.listen(port, () => {
  console.log(`health check server listening at http://localhost:${port}`);
});
