const light_sim = require('./lights-simulation');
const action_sim = require('./action-simulation');


const root = "http://localhost:3000"

const user_endpoint = root + "/user"
const device_endpoint = root + "/device"
const manager_endpoint = root + "/manager"
const control_endpoint = root + "/control"

const mylightsim = new light_sim.LightSimulation();
const myactionsim = new action_sim.ActionSimulation(mylightsim);
