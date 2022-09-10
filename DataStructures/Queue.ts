


class Queue<T> {
    private items: QueueItem[];
    private size: number;
    public constructor(){
      this.size = 0;
      this.items = [];
    }

    public enqueue(item:QueueItem): void {
        this.items.push(item);
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
        this.items.removeAtIndex(0);

        return element;
       }
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

export function isEmpty(): boolean{
   return API_QUEUE.isEmpty();
}


export function DequeueAIQueue(): QueueItem {
  const DequedElement: QueueItem = AI_QUEUE.dequeue();
  return DequedElement;
} 

export function EnqueueApiQueue(element: QueueItem): void {
 API_QUEUE.enqueue(element);
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
