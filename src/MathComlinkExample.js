import * as Comlink from "comlink";

const mathWorker = new Worker(
  new URL("./mathComlink.worker.js", import.meta.url)
);

const MathWorker = Comlink.wrap(mathWorker);

export default function MathComlinkExample() {
  const onPrimeBtnClick = async () => {
    const number = Math.floor(Math.random() * 100000000);
    const isPrime = await MathWorker.complex.isPrime(
      number,
      Comlink.proxy((prime) => {
        console.log(prime);
      })
    );

    console.log(`${number} is ${isPrime ? "" : "not "}a prime number`);

    const calc = await new MathWorker.SimpleCalculator();
    console.log(await calc.sum(1, 2));
  };

  const onFibNumberClick = async () => {
    const number = Math.floor(Math.random() * 1000);
    const fibNum = await MathWorker.complex.fibonacci(number);
    console.log(`${number}th fibonacci number is ${fibNum}`);
  };

  return (
    <div className="worker-math">
      <h3>Math Comlink Example</h3>
      <button onClick={onPrimeBtnClick}>IsPrime</button>
      <button onClick={onFibNumberClick}>fibNum</button>
    </div>
  );
}
