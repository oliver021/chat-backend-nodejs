import { Express } from 'express'
import { indexController } from '../controllers/index.server.controller'
import { authController } from '../controllers/auth.server.controller'

export default class IndexRoute {
  constructor(app: Express) {

    // the basic info home route
    app.route('/').get(indexController.index);
    
    // routes to auth system
    app.route("/auth/signin").post(authController.signIn);
    app.route("/auth/signup").post(authController.signUp);
    app.route("/auth/logout").get(authController.logout);
    app.route("/auth/user").put(authController.update);
  }
}
