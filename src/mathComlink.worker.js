import * as Comlink from "comlink";

function isPrime(num, cb) {
  var sqrtnum = Math.floor(Math.sqrt(num));
  var prime = num != 1;
  for (var i = 2; i < sqrtnum + 1; i++) {
    // sqrtnum+1
    if (num % i == 0) {
      prime = false;
      break;
    }
  }
  cb(prime);
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

class SimpleCalculator {
  sum(a, b) {
    return a + b;
  }
  subtract(a, b) {
    return a - b;
  }
  multiply(a, b) {
    return a * b;
  }
  divide(a, b) {
    return a / b;
  }
}

const exposedObj = { complex: { isPrime, fibonacci }, SimpleCalculator };

Comlink.expose(exposedObj);
