
class SocketEventListiner {
  constructor(socket){
   this.socket = socket;
  }

  newSocketBasicCommand(NewCom, func){
   this.socket.on(NewCom, ()=>{
    func(this.socket);
   });
  }
  newSocketCommandsWithArgs(NewCom, func){
    this.socket.on(NewCom,(arg)=>{
        func(this.socket, arg);
    })
  }
}

module.exports = {SocketEventListiner};


