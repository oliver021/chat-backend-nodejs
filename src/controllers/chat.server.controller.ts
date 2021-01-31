import { Request, Response } from 'express';
import { IUser, User } from '../models/user.model';
import { IMessage, Message } from '../models/message.model';


export default class ChatController {
  static MakeChatTree(username: string, contacts: IUser[], messages: IMessage[]){
    return contacts.map(user => {
      return {
         target: user,
         messages: messages.filter(msg => msg.userTarget === user.username  || msg.userAuthor === user.username)
        };
    });
  }

  public async index(req: Request, res: Response, next: Function) {
    try{
      let user = req.query["fetch"];
      const userData = await User.findOne({username: user.toString()});
      if(userData === null){
        res.status(404);
        res.end();
        return;
      }
      const hasContacts = userData.contacts !== null && userData.contacts.length > 0;
      if(hasContacts){
        const userContacts = await User.find({_id: userData.contacts})
        const messages = await Message.find({
          $or: [
            {
              userAuthor: userData.username
            }
            ,{
              "userTarget": userData.username
             }
          ]
        });
        res.json({
          current: userData,
          chats: ChatController.MakeChatTree(userData.username, userContacts, messages)
        });
      }else{
        res.json({
          current: userData,
          chats: []
        });
      }
    }
    catch(Error){
      console.log(Error);
      res.status(400);
      res.end();
    }
  }

  public async getUsers(req: Request, res: Response, next: Function){
      try{
        let query = req.query["fetch"]
        if(query){
          let result = await User.find({__id: [/*  not implement for now*/ ]});
          res.json(result);
        }else{
          // pending
        }
      }catch(err){
        res.status(400);
        res.end();
      }
  }

  public async getAllUsers(req: Request, res: Response, next: Function){
    try{
        let result = await User.find();
        res.json(result);
    }catch(err){
      res.status(400);
      res.end();
    }
}

public async addContact(req: Request, res: Response, next: Function){
  try{
      let result = await User.findOne({_id: req.body["id"]});
      result.contacts.push(req.body["contact"]);
      await result.save({validateBeforeSave: false});
      res.json(result);
  }catch(err){
    res.status(400);
    res.end();
  }
}

  public async postMessage(req: Request, res: Response, next: Function){
    let message = new Message(<IMessage> req.body);
    await message.save();
    res.status(201);
    res.json({
      id: message._id
    });
  }
}

export const chatController = new ChatController()
