const mathWorker = new Worker(new URL("./math.worker.js", import.meta.url));

const rpcWrap = (worker) => {
  return async (type, payload) => {
    return new Promise((resolve, reject) => {
      const id = `${Date.now()}-${Math.random()}`;

      worker.postMessage({ type, payload, id });

      const handler = (e) => {
        if (e.data?.id === id) {
          const { payload } = e.data;
          worker.removeEventListener("message", handler);
          resolve(payload);
        }
      };

      worker.addEventListener("message", handler);
      worker.onmessage = (e) => {};
    });
  };
};

const request = rpcWrap(mathWorker);

export default function MathRPCWorkerExample() {
  const onPrimeBtnClick = async () => {
    const res = await request("PRIME", Math.floor(Math.random() * 100000000));
    console.log(`${res.number} is ${res.isPrime ? "" : "not "}a prime number`);
  };

  const onFibNumberClick = async () => {
    const res = await request("FIBONACCI", Math.floor(Math.random() * 1000));
    console.log(`${res.number}th fibonacci number is ${res.fibNum}`);
  };

  return (
    <div className="worker-math">
      <h3>Math RPC Worker Example</h3>
      <button onClick={onPrimeBtnClick}>IsPrime</button>
      <button onClick={onFibNumberClick}>fibNum</button>
    </div>
  );
}
