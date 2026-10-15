function isPrime(n) {
    if (n <= 1)
        return false;

    for (let i = 2; i < n; i++) {
        if (n % i == 0)
            return false;
    }

    return true;
}

let n = 7;

if (isPrime(n))
    console.log("Prime");
else
    console.log("Not Prime");