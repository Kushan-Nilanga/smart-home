const light_sim = require('./lights-simulation');
const action_sim = require('./action-simulation');

const root = "http://localhost"

const mylightsim = new light_sim.LightSimulation();
const myactionsim = new action_sim.ActionSimulation(mylightsim, root);

//myactionsim.signin_user("dknathalage@gmail.com", "Hello");
myactionsim.login_user("dknathalage@gmail.com", "Hello")
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImRhdGEiOnsidXNlciI6eyJfaWQiOiI2MTQ3ZmY5NjQwZTg4Yzk4MDU0MWYwMWIifX19LCJpYXQiOjE2MzIxMTI2MDR9.91tcLOcNZwTVfEt9qlj27qm2R4OFU17u3_I1JBfbS6I"
myactionsim.verify_user(token);