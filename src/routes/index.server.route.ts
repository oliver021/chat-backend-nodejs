import { Express } from 'express'
import { indexController } from '../controllers/index.server.controller'
import { authController } from '../controllers/auth.server.controller'
import { chatController } from '../controllers/chat.server.controller';

export default class IndexRoute {
  constructor(app: Express) {

    // the basic info home route
    app.route('/').get(indexController.index);
    
    // routes to auth system
    app.route("/auth/signin").post(authController.signIn);
    app.route("/auth/signup").post(authController.signUp);
    app.route("/auth/logout").get(authController.logout);
    app.route("/auth/user").put(authController.update);

    // routes for chat system 
    app.route("/chat").get(chatController.index);
    app.route("/chat/contacts/all").get(chatController.getAllUsers);
    app.route("/chat/contacts").post(chatController.addContact);
    app.route("/chat/contacts").get(chatController.getUsers);
    app.route("/chat/message").post(chatController.postMessage);
  }
}
