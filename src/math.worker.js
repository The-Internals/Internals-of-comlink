// eslint-disable-next-line no-restricted-globals
const worker = self;

function isPrime(num) {
  var sqrtnum = Math.floor(Math.sqrt(num));
  var prime = num != 1;
  for (var i = 2; i < sqrtnum + 1; i++) {
    // sqrtnum+1
    if (num % i == 0) {
      prime = false;
      break;
    }
  }
  return prime;
}

function fibonacci(n) {
  let [a, b, temp] = [1, 0];

  while (n >= 1) {
    temp = a;
    a = a + b;
    b = temp;
    n--;
  }

  return b;
}

worker.onmessage = function (e) {
  console.log(e.data);

  const { type, payload, ...rest } = e.data;

  let result;

  switch (type) {
    case "PRIME":
      result = { number: payload, isPrime: isPrime(payload) };
      break;
    case "FIBONACCI":
      result = { number: payload, fibNum: fibonacci(payload) };
      break;
    default:
      result = payload;
  }

  worker.postMessage({ type, payload: result, ...rest });
  // setTimeout(() => {}, Math.floor(Math.random() * 3000));
};
