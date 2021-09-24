import axios from "axios";

const account = {
	signin(email, pass) { },
	login(email, pass) { }
}

const device = {
	create(token, uuid) { },
	remove(id) { },
	get(token) { }
}

const control = {
	status(token, id) { }
}

export default { account, device, control };