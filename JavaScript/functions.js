// 1. Palindrome
function palindrome(n) {
    let original = n;
    let rev = 0;

    while (n > 0) {
        let digit = n % 10;
        rev = rev * 10 + digit;
        n = Math.floor(n / 10);
    }

    if (original == rev)
        return "Palindrome";
    else
        return "Not Palindrome";
}


// 2. Prime Number
function prime(n) {
    if (n <= 1)
        return false;

    for (let i = 2; i < n; i++) {
        if (n % i == 0)
            return false;
    }

    return true;
}


// 3. Reverse a Number
function reverse(n) {
    let rev = 0;

    while (n > 0) {
        let digit = n % 10;
        rev = rev * 10 + digit;
        n = Math.floor(n / 10);
    }

    return rev;
}


// 4. Sum of Digits
function sumOfDigits(n) {
    let sum = 0;

    while (n > 0) {
        let digit = n % 10;
        sum = sum + digit;
        n = Math.floor(n / 10);
    }

    return sum;
}


// 5. Sum of N Numbers
function sumOfN(n) {
    let sum = 0;

    for (let i = 1; i <= n; i++) {
        sum = sum + i;
    }

    return sum;
}


// 6. Factorial
function factorial(n) {
    let fact = 1;

    for (let i = 1; i <= n; i++) {
        fact = fact * i;
    }

    return fact;
}


// Calling the functions
let n = 5;

console.log("Palindrome:", palindrome(121));
console.log("Prime:", prime(7));
console.log("Reverse:", reverse(1234));
console.log("Sum of Digits:", sumOfDigits(1234));
console.log("Sum of N:", sumOfN(n));
console.log("Factorial:", factorial(n));