

const QUEUESTACK = [];


class Queue {
    constructor(id){
    this.id = id;
    this.Items = [];
    this.tail = 0; 
    this.isEmpty = true; 
    this.state = null;
    }
    
    enqueue(element){
      this.Items[this.tail] = element;
      this.tail++;
      this.isEmpty = false;
      return
  }
  dequeue(){

    if(this.items.length == 0) new Error("Der Queue ist leer");

    this.Items.splice(0, 1);
    
    if(this.Items.length == 0) this.isEmpty = true;
    
    return
  }
  peek(){
    return this.Items[0];
  }

  length(){
    return this.tail;
  }

  clear(){
    this.items = [];
    this.tail = 0;
    this.isEmpty = true;
    return;
  }

  isEmpty(){
    if(this.items.length == 0) return true;
    
    return false;
  }

  
}


class QueueOperations {
    constructor(){
    
    }

    Get(GetId){
        for (let index = 0; index < QUEUESTACK.length; index++) {
            if(QUEUESTACK[index].id == GetId) return QUEUESTACK[index];
            
        }
        
       return null;
    }

    Init(NewQueue, check){
        if(NewQueue instanceof Queue == false && !check) new Error("Das Element was du im QueueStack speichern willst ist keine Queue");
        return QUEUESTACK.push(Queue);
    }

    changeState(newState,id){
        const res = this.Get(id);

        if(!res) new Error("Queue konnte im Stack nicht gefunden werden");
        
        res.state = newState;

        this.delete(id);

        this.Init(res, true);

        return;

    }

    enqueue(element, id){
        const Queue = this.Get(id);
        Queue.enqueue(element);
    }
    dequeue(id){
        const Queue = this.Get(id);
        Queue.dequeue();
    }
    peek(id){
        const Queue = this.Get(id);
        return Queue.peek();
    }
    delete(GetId){
        var IDIndex = -1
        for (let index = 0; index < QUEUESTACK.length; index++) {
            if(QUEUESTACK[index].id == GetId) {
                IDIndex = index;
                break;
            };
            
        }
        if(IDIndex < 0) throw new Error("Diese Queue gibt es nicht!");
        QUEUESTACK[IDIndex].clear();
        QUEUESTACK.splice(IDIndex, 1);
    }

    isEmpty(id){
     const Queue = this.Get(id);
     return Queue.isEmpty();
    }

    getTimeStamp(id){
        const res = this.Get(id);

        if(!res) return null;
    
        const timeStamp = res.items[0].timeStamp;

        return timeStamp;

    }

    isAvailable(ID){
       
        if(!this.Get(ID)) return false;
       
       return true;
    }

    GetState(id){
      const res = this.Get(id);

      if(!res) new Error("Queue konnt nicht gefunden werden");

      return res.state;
    }


}

module.exports = {Queue, QueueOperations};