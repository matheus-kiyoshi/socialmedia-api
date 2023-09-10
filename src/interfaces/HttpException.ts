class HttpException extends Error {
	public statusCode: number
	public message: string
	constructor(message: string, statusCode: number) {
		super(message)
		this.statusCode = statusCode
		this.message = message
	}
}

export { HttpException }