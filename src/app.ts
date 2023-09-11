import express, { Application } from 'express'
import cors from 'cors'
import 'path'
import { errorMiddleware } from './middlewares/error.middleware'
import { UserRoutes } from './routes/user.routes'
import { connect } from './infra/db'

class App {
	public app: Application
  private userRoutes = new UserRoutes()
	constructor() {
		this.app = express()
		this.middlewaresInitialize()
		this.interceptionError()
		this.initializeRoutes()
		connect()
	}

	private initializeRoutes() {
		this.app.use('/api', this.userRoutes.router)
	}

	private interceptionError() {
		this.app.use(errorMiddleware)
	}

	private middlewaresInitialize() {
		this.app.use(express.json())
		this.app.use(cors())
		this.app.use(express.urlencoded({ extended: true }))
	}

	listen() {
		this.app.listen(process.env.PORT || 3000, () => {
			console.log(`Server is running on port ${process.env.PORT || 3000}`)
		})
	}
}

export { App }
