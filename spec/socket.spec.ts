import * as http from "http";
import { expect, assert } from 'chai';
import {Socket} from "../src/socket/index";
import {Socket as ISocket} from "socket.io";

describe("The socket test", () =>{
    let server: http.Server;
    let socket: Socket;

    before(function(done) {
        const server = http.createServer(() => console.log(" -/- "));
        socket = new Socket(server);
        server.listen(7575, () => {
            console.log("BEFORE!!");
            done();
          });
      });

      after(function(done) {
        if (server) {
          server.on('close', () => {
            console.log('AFTER!!');
          });
          server.close(() => {
            console.log('CLOSING...');
            server.unref();
          });
        }
        done();
      });



    it('Test the user flow', (done) =>{
        const wsClient = <ISocket>require('socket.io-client')('http://localhost:7575/');
        wsClient.on('connection', () => console.log('Client connected'));
        wsClient.on('ready-server', () => {
            console.log('server ready...');
            wsClient.emit("ready", "my-user");
        });

        wsClient.on('user-stored', () =>{
            console.log("debug the record!!!",(<any>socket).record);
            wsClient.disconnect();
        });

        wsClient.on('disconnect', () => {
            setTimeout(() => {
                console.log("debug the record!!!",(<any>socket).record);
                done();

            }, 500);
        });
        
    });

    it('Test the message flow', (done) =>{
        const wsClientA = <ISocket>require('socket.io-client')('http://localhost:7575/');
        const wsClientB = <ISocket>require('socket.io-client')('http://localhost:7575/');
        
        wsClientA.on('ready-server', () =>  wsClientA.emit('ready', 'A'));
        wsClientB.on('ready-server', () =>  wsClientB.emit('ready', 'B'));

        wsClientA.on('user-stored', () =>{
            wsClientA.emit('recive-message', "text", "message", null, 'B', 'A');
        });

        wsClientB.on('user-stored', () =>{
            wsClientA.emit('recive-message', "text", "message", null, 'A', 'B');
        });

        let goal: number = 0;
        let close: boolean = false;

        const messageHandle = (...alls: any[]): void => {
            console.log("message-recived");
            console.log(alls);
            goal++;
        };

        wsClientA.on('send-message', messageHandle);
        wsClientB.on('send-message', messageHandle);

        const CloseSocket = () => {
            setTimeout(() => {
                console.log("debug the record!!!", (<any>socket).record);
                if(close === true){
                    done();
                }else{
                    close = true;
                }

            }, 500);
        };
        
        // observe the goal state to close
        setInterval(() =>{
            if(goal === 2){
                wsClientA.disconnect();
                wsClientB.disconnect();
            }
        }, 500);

        // end test
        wsClientA.on('disconnect', CloseSocket);
        wsClientB.on('disconnect', CloseSocket);
        
    });

});