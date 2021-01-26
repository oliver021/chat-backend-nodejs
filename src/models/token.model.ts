import { Document, Model, model, Schema } from 'mongoose'
import {x2 as Sha256} from "sha256"
import { uuidGenerator } from '../helpers/index';
import { IUser } from './user.model';


export interface IToken extends Document {
  toekn: string
  user: IUser,
  expired: Date
}

export let TokenSchema: Schema = new Schema({
  token: {
    type: Schema.Types.String,
    required: true,
    unique: true,
    maxlength: 64,
    default: Sha256(uuidGenerator())
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  expired: {
    type: Schema.Types.Date,
    default: Date.now() + 604800 // add seven days by seconds
  },
})

export const Token: Model<IToken> = model<IToken>(
  'Token',
  TokenSchema,
)
