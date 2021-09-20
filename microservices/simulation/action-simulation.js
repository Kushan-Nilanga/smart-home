/**
 * TODO
 *
 * 1. Create User
 * 2. Login User
 * 3. Verification
 *
 * 4. Add light
 * 5. Change light
 * 6. Remove light
 */


class ActionSimulation {
	user_endpoint
	control_endpoint
	manager_endpoint

	user_functions = {
		signin_user() { },
		login_user() { },
		verify_user() { }
	}

	control_functions = {
		light_status() { }
	}

	manager_functions = {
		add_light() { },
		remove_light() { }
	}

	constructor(light_sim, dns) {

		user_endpoint = dns + "/user"
		control_endpoint = dns + "/control"
		manager_endpoint = dns + "/manager"
	}
}

module.exports = { ActionSimulation }