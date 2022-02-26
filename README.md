Agenda

## What's a web worker?

- JS is single thread language. All the task Layout, JS Execution, Animations all run in single thread.
- Web worker allows you to offload task in another thread.

```js
var myWorker = new Worker("worker.js");
```

## postMessage and onmessage.

```js
// main.js
myWorker.onmessage = function (e) {
  console.log(e.data);
  console.log("Message received from worker");
};

myWorker.postMessage("Message from main thread");
```

```js
// worker.js
self.onmessage = (e) => {
  console.log(e.data);
  console.log("Message received from worker");

  self.postMessage(arrayBuffer, [arrayBuffer.buffer]);
};
```

## Structure cloning and transferrable objects

- On post messages passed data are structure cloned.
- https://github.com/GoogleChromeLabs/comlink/blob/main/structured-clone-table.md
- https://surma.dev/things/is-postmessage-slow/
- Transferrable objects are transferred from one process to another, and once transferred, its no longer accessible on first process

## RPC communication for async messages

- Sending message and receiving message is collocated and can happen out of order.
- Request response protocol makes code more maintainable.
- comlink has own RPC interface for cross process communication.
- JSON-RPC is an standard protocol for cross process communication in JSON format. (https://en.wikipedia.org/wiki/JSON-RPC)

## ES6 Proxies

- Proxy allows intercepting operations in a object.
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

```js
const obj = {
  a: 2,
  b: 3,
  sum: function () {
    this.a + this.b;
  }
};

const handler = {
  get: (target, prop) {} // obj.a
  set: (target, prop, value) // obj.a = 2
  apply: (target, thisArg, args) //obj.sum();
}


const proxyObj = new Proxy({}, handler)
```

## How does comlink uses RPC and ES6 proxies to expose objects from workers to the main thread?

### wrap

- wrap create a proxy which virtually represent web worker exposed object.
- On any operation to the proxy, it translates it to a path (for the property you are accessing/updating/calling) and operation (GET/SET/APPLY).
- For apply it passes all arguments to worker.

### expose

- Expose listen to the message from different process, and based on the passed path, it locates the property in worker thread, and apply defined operation.

## How callback works with the comlink

### Transfer Handler

- Not all objects can structured cloned or are transferrable.
- Transfer handler provides serialize and deserialize method, and canHandle function to check if it can handle an object.
- The serialize method returns an object which can be transferred.

```js
Comlink.transferHandlers.set("EVENT", {
  canHandle: (obj) => obj instanceof Event,
  serialize: (ev) => {
    return [
      {
        target: {
          id: ev.target.id,
          classList: [...ev.target.classList],
        },
      },
      [],
    ];
  },
  deserialize: (obj) => obj,
});
```

### Message Channel

- Message channel creates port through which data can be transferred.
- One port is kept in one process and another is passed to different process. Ports are transferrable objects.
- Process can communicate through this ports using postMessage and onmessage handler.

```js
var channel = new MessageChannel();

channel.port1.onMessage = (e) => {};

channel.port2.postMessage("some data");
```

### proxyTransferHandler

- serialize creates a message channel, and exposes the object through channel's one port.
- deserialize wraps the another port of channel, and creates proxy which translates all the operations to path and operation type, and transfer this information through ports.

### Handling callbacks

- comlink marks the callback to be handled with proxy transfer handler.
- callback is exposed from main thread to worker thread and proxied on worker thread.

## How errors are handled with the comlink.

- Error objects are not transferrable.
- A custom transfer handler is created for transferring error object.

## How transferrable object works with the comlink.

- Transferrable objects are required to tracked before passing, which keeps the transferrable buffer in caches (with object as key),
- Then while passing it as argument, it internally passes the transferrable buffer.
