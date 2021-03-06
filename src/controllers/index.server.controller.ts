import { Request, Response } from 'express'

export default class IndexController {
  public index(req: Request, res: Response, next: Function): void {
    res.render('index', { title: 'Chat Backend Microservice' })
  }
}

export const indexController = new IndexController()
