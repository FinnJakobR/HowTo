


class Queue<T> {
    private items: QueueItem[];
    private size: number;
    public constructor(){
      this.size = 0;
      this.items = [];
      console.log("INIT NEW QUEUE");
    }

    public enqueue(item:QueueItem): void {
        this.items.push(item);
        console.log("ENQUEUE: ");
        console.log(this.items.length);
        console.log(item);
        this.size++;
    }

    public isEmpty(): boolean {
        
        if(this.size === 0) return true;

        return false;
    }

    public dequeue(): QueueItem {
        var element: QueueItem; 

       if(this.isEmpty()) throw new Error("Could not dequeue... Queue is Empty");

       else {

        element = this.items[0];
        this.items.splice(0,1);
        console.log("DEQUEUE: " + this.items.length);

        return element;
       }
    }
    
//TODO: Add to API
    public DeleteUserFromQueue(_id:string){
      for (let index = 0; index < this.items.length; index++) {
       if(this.items[index]._ID == _id){
        this.items.splice(index, 1);
       }
      }

      return;
    }

    public print(): void {
        for (let index = 0; index < this.items.length; index++) {
            console.log("Value at Index: " + index + " .... " + this.items[index]);  
        }
    }
}

var AI_QUEUE = new Queue();

var API_QUEUE = new Queue();

var VIDEO_QUEUE = new Queue();


function CreateApiQueue():void {
    API_QUEUE = new Queue();
  }
  
  function CreateAIQueue():void {
      AI_QUEUE = new Queue();
    }
  
  function CreateVideoQueue():void {
      VIDEO_QUEUE = new Queue();
    }

    

export function CreateQueues(): void {
    CreateApiQueue();
    CreateAIQueue();
    CreateVideoQueue();
}

 function isEmpty(): boolean{
   return API_QUEUE.isEmpty();
}


export function DequeueAIQueue(): QueueItem {
  const DequedElement: QueueItem = AI_QUEUE.dequeue();
  return DequedElement;
} 

export function EnqueueApiQueue(element: QueueItem): void {
 API_QUEUE.enqueue(element);

}

export function DeleteUserFromQueue(_id: string): void {
  
  API_QUEUE.DeleteUserFromQueue(_id);
  AI_QUEUE.DeleteUserFromQueue(_id);
  VIDEO_QUEUE.DeleteUserFromQueue(_id);

  return;

}

export function DequeueApiQueue(): QueueItem {
    const DequedElement: QueueItem = API_QUEUE.dequeue();
    return DequedElement
  } 

  export function EnqueueVideoQueue(element: QueueItem): void {

    if(!element.URL) throw Error("URL is not defined");

    VIDEO_QUEUE.enqueue(element);

    return;
  }

  export function DequeueVideoQueue(): QueueItem {
    const DequedElement: QueueItem = VIDEO_QUEUE.dequeue();
    return DequedElement;
  } 

  export function EnqueueInQueue(element: QueueItem): void {
    AI_QUEUE.enqueue(element);

    return;
  } 
