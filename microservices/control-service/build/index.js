"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var port = process.env.PORT || 3000;
/**
 * Functionality
 *	1. Send messages to turn 1 light on/off.
 * 	2. Send messages to turn batch of lights on/off.
 *  3. Health checks.
 */
// Abstract entity of Control State
var DataInstance = /** @class */ (function () {
    function DataInstance(date, id, state) {
        if (date === void 0) { date = new Date(); }
        if (id === undefined || state === undefined)
            throw console.error("Missing data value");
        this.id = id;
        this.date = date;
        this.state = state;
    }
    return DataInstance;
}());
var ControlState = /** @class */ (function () {
    function ControlState(data) {
        var _this = this;
        if (typeof data === typeof Array())
            this.controlstate = data;
        if (data.controlstate === undefined)
            throw console.error("Type error");
        this.controlstate = [];
        data.controlstate.forEach(function (element) {
            _this.controlstate.push(new DataInstance(element.date, element.id, element.state));
        });
    }
    return ControlState;
}());
// Abstract entity of Health State
var HealthInstance = /** @class */ (function () {
    function HealthInstance(id, state) {
        if (id === undefined || state === undefined)
            throw console.error("Missing data value");
        this.id = id;
        this.state = state;
    }
    return HealthInstance;
}());
var HealthState = /** @class */ (function () {
    function HealthState(data) {
        var _this = this;
        if (typeof data === typeof Array())
            this.healthstate = data;
        if (data.healthstate === undefined)
            throw console.error("Type error");
        this.healthstate = [];
        data.healthstate.forEach(function (element) {
            _this.healthstate.push(new HealthInstance(element.id, element.state));
        });
    }
    return HealthState;
}());
//------------ Server Code ----------------
var app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get("/", function (req, res) {
    res.status(200).send("control server active 🎮");
});
// Light status updates
app.post("/status", function (req, res) {
    var status;
    try {
        status = new ControlState(req.body);
    }
    catch (err) {
        console.log(err);
        return res.send(err);
    }
    res.send(JSON.stringify(status));
    // TODO send control requests to communication server
});
// Manual health checks
app.post("/health", function (req, res) {
    var checks;
    try {
        checks = new HealthState(req.body);
    }
    catch (err) {
        console.log(err);
        return res.send(err);
    }
    res.send(JSON.stringify(checks));
    // TODO send control requests to communication server
});
app.listen(3000, function () {
    console.log("control server \uD83C\uDFAE listening at http://localhost:" + port);
});
// Manual Health checks
// TODO:
// get devices from devices service
// run health checks on random devices
// send those commands to communication server
setInterval(function () { }, 2000);
//# sourceMappingURL=index.js.map