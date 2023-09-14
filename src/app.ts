import express, { Application } from 'express'
import { errorMiddleware } from './middlewares/error.middleware'
import { UserRoutes } from './routes/user.routes'
import { PostRoutes } from './routes/posts.routes'
import { connect } from './infra/db'
import cors from 'cors'
import 'path'
import path from 'path'

class App {
	public app: Application
	private userRoutes = new UserRoutes()
	private postRoutes = new PostRoutes()
	constructor() {
		this.app = express()
		this.middlewaresInitialize()
		this.interceptionError()
		this.initializeRoutes()
		connect()
	}

	private initializeRoutes() {
	  this.app.use('/api', this.userRoutes.router)
	  this.app.use('/api', this.postRoutes.router)
	}

	private interceptionError() {
		this.app.use(errorMiddleware)
	}

	private middlewaresInitialize() {
		this.app.use(express.json())
		this.app.use(cors())
		this.app.use(express.urlencoded({ extended: true }))
		this.app.use('/media', express.static(path.join(__dirname, './tmp/uploads')))
	}

	listen() {
		this.app.listen(process.env.PORT || 3000, () => {
			console.log(`Server is running on port ${process.env.PORT || 3000}`)
		})
	}
}

export { App }
