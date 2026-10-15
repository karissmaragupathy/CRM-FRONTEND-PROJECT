let n = 12345;
let sum = 0;
let digit;

while (n > 0) {
    digit = n % 10;
    sum = sum + digit;
    n = Math.floor(n / 10);
}

console.log("Sum of digits = ", sum);