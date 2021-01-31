import { SocketRecord } from './contract';
import * as socket from 'socket.io';
import { MessageType, UserState } from '../models/contract';
import { Message } from '../models/message.model';

/**
 * @fucntion createUserTelling
 * @param record The global record of conections
 * @param client The socket object session
 * @description The factory to create a handler for telling event
 */
export function createUserTelling(record: SocketRecord,  user: string, type: UserState){
    return () => {
        if(record.has(user)){
            record.get(user).status = type;
        }else{
            record.set(user, {
                id: null,
                status: "offline"
            })
        }
    };
}

/**
 * @fucntion createOnReady
 * @param record The global record of conections
 * @param client The socket object session
 * @description The factory to create a handler for ready event
 */
export function createOnReady(record: SocketRecord, client: socket.Socket){
    return (userId: string) => {
        console.log("username ----------------------------------- >>>>>",userId);
        record.set(userId, {
            id: client.id,
            status: "online"
        });
        client.emit("user-stored");
    }
}

/**
 * @fucntion createOnReciveMsg
 * @param record The global record of conections
 * @param client The socket object session
 * @description The factory to create a handler for the event that recive a message of chat
 */
export function createOnReciveMsg(record: SocketRecord, client: socket.Socket){
    return (type: MessageType, source: string, reply: number, target: string, myId: string) => {
        console.log("the target => " + target, "the source: " + source);
        console.log("the record ======> ", record);
        console.log("the socket ======> ", client.nsp.sockets.keys());
        console.log("the identifier ======> ",  record.get(target));
        if(record.has(target)){
            const userTarget = record.get(target);
            if(userTarget.status !== 'offline' && client.nsp.sockets.has(userTarget.id)){
                console.log("the selected          --------------------- >",userTarget);
                client.nsp.sockets.get(userTarget.id).emit("send-message", type, source, reply, new Date, myId); 
            }
        }
        
        let msg = new Message({
            type: type,
            source: source,
            reply: reply,
            userAuthor: myId,
            userTarget: target

        });
        msg.save()
        .then( () => client.emit("message-saved", msg._id))
        .catch(err => console.log(err));
       
    };
}

/**
 * @fucntion createOnReady
 * @param record The global record of conections
 * @param client The socket object session
 * @description The factory to create a handler for ready event
 */
export function createOnConfirmedMsg(record: SocketRecord, client: socket.Socket){
    return (msgId: string) => record.set(msgId, {
        id: client.id,
        status: "online"
    });
}

/**
 * @fucntion createOnReady
 * @param record The global record of conections
 * @param client The socket object session
 * @description The factory to create a handler for ready event
 */
export function createOnReadedMsg(record: SocketRecord, client: socket.Socket){
    return (msgId: string) => record.set(msgId, {
        id: client.id,
        status: "online"
    });
}