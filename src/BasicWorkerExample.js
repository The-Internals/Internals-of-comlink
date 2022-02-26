const basicWorker = new Worker("worker.js");

basicWorker.onmessage = function (e) {
  console.log(e.data);
};

export default function BasicWorkerExample() {
  const onBasicWorkerClick = () => {
    basicWorker.postMessage("Message from main thread");
  };

  return (
    <div className="worker-base">
      <h3>Basic Worker Example</h3>
      <button onClick={onBasicWorkerClick}>Send Message</button>
    </div>
  );
}
