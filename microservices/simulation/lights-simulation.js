/**
 * TODO
 *
 * 1. Connect to network
 * 2. Change state
 * 3. Simulate health
 */
const uuid = require('uuid');
const mqtt = require('mqtt');
const crypto = require('crypto');
const encrypto = require('./e2e-encrypt');

const mqtturl = "mqtt://test.mosquitto.org";

class Light {
	uuid
	state
	health
	client
	secret = "mysecret"

	constructor() {
		this.health = "ok"
		this.uuid = uuid.v4();
		this.client = mqtt.connect(mqtturl)
		this.client.on('connect', () => {
			this.client.subscribe(`smartlight/${this.uuid}`).on('message', (topic, message) => this.got_message(topic, message.toString()))
		})
	}

	got_message(topic, message) {
		const request = encrypto.decrypt(message, this.secret);
		switch (request) {
			case "health":
				const encrypted = encrypto.encrypt(this.health, this.secret)
				this.client.publish(`smartlight/${this.uuid}`, encrypted);
				break;
			case "on":
				this.state = "on"
				break;
			case "off":
				this.state = "off"
				break;
		}
	}
}

class LightSimulation {
	light_list
	constructor(num_lights = 1) {
		this.light_list = []
		for (let i = 0; i < num_lights; i++) {
			this.light_list.push(new Light())
		}
	}

}

module.exports = { LightSimulation };