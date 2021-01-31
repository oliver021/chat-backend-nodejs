import { Document, Model, model, Schema } from 'mongoose'

export interface IMessage extends Document {
  type: string;
  source: string;
  reply?: string;
  status?: string;
  userTarget: string;
  userAuthor: string;
  sentDate?: Date;
}

export let MessageSchema: Schema = new Schema({
  type: {
    type: Schema.Types.String,
    required: true,
    enum: ["text", "emoji","image","sticker"],
    default: "text"
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
    enum: ["sent", "readed", "uploading","recived"],
    default: "sent"
  },
  reply:{
      type: Schema.Types.ObjectId,
      required: false
  },
  userAuthor:{
      type: Schema.Types.String,
      required: true,
  },
  userTarget:{
    type: Schema.Types.String,
    required: true,
 }
})

export const Message = model<IMessage>(
  'Message',
  MessageSchema,
)
