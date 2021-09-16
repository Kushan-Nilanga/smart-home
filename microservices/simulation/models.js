class Light {
	id
	uuid
	data
	health
	state
	constructor() { }
}

class User {
	email
	pass
}

class DataInstance {
	id
	data
	state
}

class ControlState {
	controlstate
}

class HealthInstance {
	id
	state
}

class HealthState {
	healthstate
}

module.exports = { Light, User, DataInstance, ControlState, HealthInstance, HealthState };