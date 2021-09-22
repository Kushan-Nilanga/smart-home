import { Request } from "express";
import express from "express";
import bodyParser from "body-parser";

const port = process.env.PORT || 3020;
const data_service =
  process.env.DATA_SERVICE || "http://localhost:4000/graphql";

/**
 * Functionality
 *	1. Send messages to turn 1 light on/off.
 * 	2. Send messages to turn batch of lights on/off.
 *  3. Health checks.
 */

// Abstract entity of Control State
class DataInstance {
  id: string;
  date: Date;
  state: string;
  constructor(date: Date = new Date(), id: string, state: string) {
    if (id === undefined || state === undefined)
      throw console.error("Missing data value");
    this.id = id;
    this.date = date;
    this.state = state;
  }
}

class ControlState {
  controlstate: Array<DataInstance>;
  constructor(data: any) {
    if (typeof data === typeof Array<DataInstance>())
      this.controlstate = data as Array<DataInstance>;
    if (data.controlstate === undefined) throw console.error("Type error");
    this.controlstate = [];
    data.controlstate.forEach((element: DataInstance) => {
      this.controlstate.push(
        new DataInstance(element.date, element.id, element.state)
      );
    });
  }
}

// Abstract entity of Health State
class HealthInstance {
  id: string;
  state: string;
  constructor(id: string, state: string) {
    if (id === undefined || state === undefined)
      throw console.error("Missing data value");

    this.id = id;
    this.state = state;
  }
}

class HealthState {
  healthstate: Array<HealthInstance>;
  constructor(data: any) {
    if (typeof data === typeof Array<HealthInstance>()) this.healthstate = data;
    if (data.healthstate === undefined) throw console.error("Type error");
    this.healthstate = [];
    data.healthstate.forEach((element: HealthInstance) => {
      this.healthstate.push(new HealthInstance(element.id, element.state));
    });
  }
}

//------------ Server Code ----------------
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("control server active 🎮");
});

// Light status updates
app.post("/status", (req, res) => {
  var status;
  try {
    status = new ControlState(req.body);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
  res.send(JSON.stringify(status));
  // TODO send control requests to communication server
});

// Manual health checks
app.post("/health", (req, res) => {
  var checks;
  try {
    checks = new HealthState(req.body);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
  res.send(JSON.stringify(checks));
  // TODO send control requests to communication server
});

app.listen(port, () => {
  console.log(`control server 🎮 listening at http://localhost:${port}`);
});

// Manual Health checks
// TODO:
// get devices from devices service
// run health checks on random devices
// send those commands to communication server
