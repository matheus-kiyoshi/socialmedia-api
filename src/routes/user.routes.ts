import { Router } from 'express'

class UserRoutes {
  public router: Router
  constructor() {
    this.router = Router()
    this.initRoutes()
  }

  initRoutes() {
    // default route => /api/
    this.router.get('/', (req, res) => {
      res.send('Hello World!')
    })
  }
}

export { UserRoutes }