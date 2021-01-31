import { Server } from 'http'
import { SocketRecord } from './contract';
import { createUserTelling, createOnReady, createOnReciveMsg, createOnConfirmedMsg, createOnReadedMsg } from './eventHandlers';
const io = require('socket.io');
import {Socket as EngineSocket} from "socket.io"

export class Socket {

  public io: EngineSocket;  
  private record: SocketRecord = new Map;

  constructor(http: Server) {
    this.io = <EngineSocket>io(http);
    this.connect();
  }

  public connect() {
    this.io.on('connection', (client: EngineSocket) => {
      // tslint:disable-next-line: no-console
      console.info(`Socket is connected : ${client.id}`);
      this.handlers(client);
      client.emit('ready-server');
    });
  }

  public handlers(client: EngineSocket) {
    // on the user is ready
    client.on('ready',  createOnReady(this.record, client));
    
    // define many handlers to chat flow
    client.on('tell-online', user => createUserTelling(this.record, user, "online"));
    client.on('tell-bussy', user => createUserTelling(this.record, user, "bussy"));
    client.on('recive-message', createOnReciveMsg(this.record, client));
    client.on('confirmed-message', createOnConfirmedMsg(this.record, client));
    client.on('readed-message', createOnReadedMsg(this.record, client));


    // on the user is disconected or close session in chat
    client.on('disconnect', () => {
      console.log("user disconect", client.id);
      createUserTelling(this.record, this.getUserByClient(client), "offline")();
    })
  }

  getUserByClient(client: EngineSocket): string{
    let iterator = this.record.entries();
    let current = iterator.next();
    while(!current.done){
      if(current.value[1].id === client.id){
        return current.value[0]
      }
    }
    return null;
  }
}
