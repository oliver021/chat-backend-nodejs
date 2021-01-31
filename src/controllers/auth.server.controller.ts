import { Request, Response } from 'express'
import { User } from '../models/user.model';

export default class AuthController {
  
  public async signIn(req: Request, res: Response)  {
    const user = await User.findOne({username: req.body["username"]});

    if(user.password === req.body["password"]){
        res.json(user);
    }else{
        res.status(401);
        res.json({type:1});
    }
}

  public async signUp(req: Request, res: Response) {
   try{
    console.log(req.params);
    var nickname = req.body["nickname"];
    var username = req.body["username"];
    var password = req.body["password"];
    const user = new User({
        nickname: nickname,
        username: username,
        password: password,
        avatarUrl: "/img/avatar3.png"
    });
    await user.save();
    res.json(user);
   }catch(Error){
    res.status(400);
    res.json({message:"invalid response"});
   }
  }

  public logout(req: Request, res: Response): void {
    res.json({ msg: 'Hello!' })
  }

  public update(req: Request, res: Response): void {
    res.json({ msg: 'Hello!' })
  }
}

export const authController = new AuthController();