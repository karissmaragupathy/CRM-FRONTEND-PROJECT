let n = 3;
let count = 0;
let i;
for (i = 1; i <= n; i++) {
    if (n % i == 0)
        count++;
}
if (count == 2)
    console.log("Prime");
else
    console.log("Not prime");