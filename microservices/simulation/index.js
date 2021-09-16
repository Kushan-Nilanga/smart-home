const { Light } = require('./models');

require('./models');

class LightSimulation {
	lights;
	constructor(numLights = 1000) {
		this.lights = []
		for (let i = 0; i < numLights; i++) {
			this.lights.push(new Light());
		}
	}
}

new LightSimulation(10);