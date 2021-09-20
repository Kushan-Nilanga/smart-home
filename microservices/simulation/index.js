const light_sim = require('./lights-simulation');
const action_sim = require('./action-simulation');


const root = "http://localhost:3000"

const mylightsim = new light_sim.LightSimulation();
new action_sim.ActionSimulation(mylightsim, root);
