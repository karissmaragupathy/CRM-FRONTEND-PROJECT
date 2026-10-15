let n = 1234;
let digit;
let rev = 0;
while (n > 0) {
    digit = n % 10;
    rev = rev * 10 + digit;
    n = Math.floor(n / 10);
}
console.log(rev);