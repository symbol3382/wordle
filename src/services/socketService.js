import axios from 'axios';
import { io } from 'socket.io-client'


class WebSocketService {
    constructor() {
        // if (!WebSocketService.instance) {
        //     this.socket = io('http://localhost:3500', {
        //       extraHeaders: {
        //         "username": localStorage.getItem('username')
        //       }
        //     }); // Replace with your WebSocket URL
        //     this.socket.addEventListener('wordle-input', this.handleMessage);
        //     this.socket.addEventListener('response', this.handleResponse);
        //     this.listeners = [];
        //     this.response = [];
        //     WebSocketService.instance = this; // Store the instance
        //   }
      
        //   return WebSocketService.instance; // Return the existing instance
        // console.log('username >>',localStorage.getItem('username'))
        // console.log('roomname>>>>>',  localStorage.getItem('roomid'))
        
        // this.socket = io('http://localhost:3500', {
        //     extraHeaders: {
        //       "username": localStorage.getItem('username'),
        //       "roomname": localStorage.getItem('roomid')
        //     }})
        //   this.socket.addEventListener('wordle-input', this.handleMessage);
        //   this.socket.addEventListener('response', this.handleResponse)
          this.listeners = [];
          this.response = [];
          this.wordleChat = []
        }

    initializeSocket() {
      console.log('initialized web socket.')
        if(!this.socket){
          
        this.socket = io('http://localhost:3500', {
            extraHeaders: {
                'username': localStorage.getItem('username'),
                'roomname': localStorage.getItem('roomid')
            }
        })
        this.socket.addEventListener('wordle-input', this.handleMessage);
        this.socket.addEventListener('response', this.handleResponse)
        this.socket.addEventListener('wordle-chat', this.handleWordleChat)
      }

    }

    sendMessage(msg) {
        this.socket.emit('wordle-input', msg)
      }


    sendChatMessage(msg) {
      this.socket.emit('wordle-chat', msg)
    }
  
    handleMessage = (event) => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    };

    handleResponse = (event) =>{
        this.response.forEach((response) => {
            response(event)
        })
    }

    handleWordleChat = (event) => {
      console.log('recieved a chat message')
      this.wordleChat.forEach((response) => {
        response(event)
      })
    }
  
    addMessageListener = (listener) => {
      this.listeners.push(listener);
    };

    addResponseListener = (listener) => {
        this.response.push(listener)
    }

    addChatListener = (listener) => {
      console.log('chat listener is added')
      this.wordleChat.push(listener)
    }


  
    removeMessageListener = (listener) => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };

    removeResponseListener = (listener) => {
        this.response = this.response.filter((l) => l !== listener )
    }
  
    closeSocket = () => {
      this.socket.close();
    };
  }
  
  const webSocketService = new WebSocketService();
export default webSocketService;