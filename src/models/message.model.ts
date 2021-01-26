import { Document, Model, model, Schema } from 'mongoose'

export interface IMessage extends Document {
  name: string
  creted: Date
}

export let MessageSchema: Schema = new Schema({
  type: {
    type: Schema.Types.String,
    required: true,
    enum: ["text", "emoji","image","sticker"]
  },
  source: {
    type: Schema.Types.String,
    required: true,
  },
  sentDate: {
    type: Schema.Types.Date,
    required: true,
    default: Date.now(),
  },
  status: {
    type: Schema.Types.String,
    required: true,
    enum: ["sent", "readed", "uploading","recived"]
  },
  replyMessage:{
      type: Schema.Types.ObjectId,
      required: false
  },
  userAuthor:{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
  },
  userTarget:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
 }
})

export const Message: Model<IMessage> = model<IMessage>(
  'Message',
  MessageSchema,
)
