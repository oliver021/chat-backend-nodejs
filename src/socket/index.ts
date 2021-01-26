import { Server } from 'http'
import * as socket from 'socket.io'
import { SocketRecord } from './contract';
import { createUserTelling, createOnReady, createOnReciveMsg, createOnConfirmedMsg, createOnReadedMsg } from './eventHandlers';

export class Socket {

  public io: socket.Server;
  
  private record: SocketRecord = new Map;

  constructor(http: Server) {
    this.io = socket(http);
    this.connect();
  }

  public connect() {
    this.io.on('connection', (client: socket.Socket) => {
      // tslint:disable-next-line: no-console
      console.info(` connected : ${client.id}`);
      this.handlers(client);
    })
  }

  public handlers(client: socket.Socket) {
    // on the user is ready
    client.on('ready',  createOnReady(this.record, client));
    
    // define many handlers to chat flow
    client.on('tell-online', createUserTelling(this.record, client, "online"));
    client.on('tell-bussy', createUserTelling(this.record, client, "bussy"));
    client.on('recive-message', createOnReciveMsg(this.record, client));
    client.on('confirmed-message', createOnConfirmedMsg(this.record, client));
    client.on('readed-message', createOnReadedMsg(this.record, client));


    // on the user is disconected or close session in chat
    client.on('disconnect', () => {
      createUserTelling(this.record, client, "offline")();
    })
  }
}
