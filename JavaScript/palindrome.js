let n = 111;
let original = n;

let digit;
let rev = 0;

while (n > 0) {
    digit = n % 10;
    rev = rev * 10 + digit;
    n = Math.floor(n / 10);
}

if (rev == original)
    console.log("palindrome");
else
    console.log("Not a palindrome");