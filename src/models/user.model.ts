import { Document, Model, model, Schema } from 'mongoose'

export interface IUserInfo{
  nickname: string
  username: string,
  stutusMsg?: string,
  avatarUrl?: string,
}

export interface IUser extends Document {
  nickname: string
  created?: Date,
  username: string,
  password: string,
  stutusMsg?: string,
  avatarUrl?: string,
  status?: string,
  contacts?: string[]
}

export let UserSchema: Schema = new Schema({
  nickname: {
    type: Schema.Types.String,
    required: true,
  },
  username: {
    type: Schema.Types.String,
    required: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  stutusMsg: {
    type: Schema.Types.String,
  },
  avatarUrl: {
    type: Schema.Types.String,
    default: "/img/default.png"
  },
  status:{
    type: "string",
    enum: ["online", "bussy", "offline"],
    default: "offline"
  },
  created: {
    type: Schema.Types.String,
    default: Date.now(),
  },
  contacts: {
    type: Schema.Types.Array,
    default: []
  }
})

export const User: Model<IUser> = model<IUser>(
  'User',
  UserSchema,
)
