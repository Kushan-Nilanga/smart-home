// Encrypt Decrypt for end to end
module.exports = {
	encrypt(text, password) {
		const key = password.repeat(32).substr(0, 32)
		const iv = password.repeat(16).substr(0, 16)
		const cipher = crypto.createCipheriv('aes-256-ctr', key, iv)
		let encrypted = cipher.update(text, 'utf8', 'hex')
		encrypted += cipher.final('hex')
		return encrypted
	},

	decrypt(text, password) {
		const key = password.repeat(32).substr(0, 32)
		const iv = password.repeat(16).substr(0, 16)
		const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv)
		let decrypted = decipher.update(text, 'hex', 'utf8')
		decrypted += decipher.final('utf8')
		return decrypted
	}
}