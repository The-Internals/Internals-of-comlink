import { useEffect } from "react";

const mathWorker = new Worker(new URL("./math.worker.js", import.meta.url));

export default function MathWorkerExample() {
  useEffect(() => {
    const handler = (e) => {
      const { type, payload } = e.data;
      switch (type) {
        case "PRIME":
          console.log(
            `${payload.number} is ${
              payload.isPrime ? "" : "not "
            }a prime number`
          );
          break;
        case "FIBONACCI":
          console.log(
            `${payload.number}th fibonacci number is ${payload.fibNum}`
          );
          break;
        default:
          console.log(payload);
      }
    };

    mathWorker.addEventListener("message", handler);

    return () => mathWorker.removeEventListener("message", handler);
  });

  const onPrimeBtnClick = () => {
    mathWorker.postMessage({
      type: "PRIME",
      payload: Math.floor(Math.random() * 100000000),
    });
  };

  const onFibNumberClick = () => {
    mathWorker.postMessage({
      type: "FIBONACCI",
      payload: Math.floor(Math.random() * 1000),
    });
  };

  return (
    <div className="worker-math">
      <h3>Math Worker Example</h3>
      <button onClick={onPrimeBtnClick}>IsPrime</button>
      <button onClick={onFibNumberClick}>fibNum</button>
    </div>
  );
}
