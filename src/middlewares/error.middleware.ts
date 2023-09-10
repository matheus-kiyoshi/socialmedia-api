import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../interfaces/HttpException'

export function errorMiddleware(
	error: HttpException,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: NextFunction
) {
	const status: number = error.statusCode ?? 500
	const message: string = error.message ?? 'Internal Server Error'

	res.status(status).json({
		status,
		message
	})
}