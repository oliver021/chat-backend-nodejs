import { SocketRecord } from './contract';
import * as socket from 'socket.io';
import { MessageType, UserState } from 'models/contract';

/**
 * @fucntion createUserTelling
 * @param record The global record of conections
 * @param client The socket object session
 * @description The factory to create a handler for telling event
 */
export function createUserTelling(record: SocketRecord, client: socket.Socket, type: UserState){
    return  () => {
        record.get(client.id).status = type;
    };
}

/**
 * @fucntion createOnReady
 * @param record The global record of conections
 * @param client The socket object session
 * @description The factory to create a handler for ready event
 */
export function createOnReady(record: SocketRecord, client: socket.Socket){
    return (userId: string) => record.set(userId, {
        id: client.id,
        status: "online"
    });
}

/**
 * @fucntion createOnReciveMsg
 * @param record The global record of conections
 * @param client The socket object session
 * @description The factory to create a handler for the event that recive a message of chat
 */
export function createOnReciveMsg(record: SocketRecord, client: socket.Socket){
    return (type: MessageType, source: string, reply: number, target: string, myId: string, tmpMsgId: string) => {
        const userTarget = record.get(target);

        client.nsp.sockets[userTarget.id].emit("send-message", type, source, reply, myId);
        client.emit("message-saved", tmpMsgId);
    };
}

/**
 * @fucntion createOnReady
 * @param record The global record of conections
 * @param client The socket object session
 * @description The factory to create a handler for ready event
 */
export function createOnConfirmedMsg(record: SocketRecord, client: socket.Socket){
    return (userId: string) => record.set(userId, {
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
    return (userId: string) => record.set(userId, {
        id: client.id,
        status: "online"
    });
}