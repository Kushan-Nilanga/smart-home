import os from "os";
import mqtt from "mqtt";
import express from "express";

const port = process.env.PORT || 3000;
const mqtt_url = process.env.MQTT || "mqtt://test.mosquitto.org";
const data_service = process.env.DATA_SERVICE || "http://localhost:4000";

var app = express();
const client = mqtt.connect(mqtt_url).on("connect", () => {
  client.subscribe("/smart-light/#");
});

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("mqtt-service active, host: " + os.hostname());
});

// start the express server
app.listen(port, () => {
  console.log(`server started at http://127.0.0.1:${port}`);
});
