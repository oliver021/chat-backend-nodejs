import { Request, Response } from 'express'
import { IUser, User } from 'models/user.model';
import { IMessage } from '../models/message.model';

export default class ChatController {
  public async index(req: Request, res: Response, next: Function) {
    let result: Array<{user: IUser, messages: IMessage[]}> = [];
    var user = req.query["fetch"][0];
    const userData = await User.findOne({username: user});
    res.json(result);
  }
}

export const chatController = new ChatController()
