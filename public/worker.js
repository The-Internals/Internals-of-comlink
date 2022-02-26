// eslint-disable-next-line no-restricted-globals
const worker = self;

worker.onmessage = function (e) {
  console.log(e.data);
  console.log("Message received from worker");

  worker.postMessage("Message from worker thread");
};
