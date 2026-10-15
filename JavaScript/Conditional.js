//Simple If
let age = 30
if (age >= 18)
    console.log("Select this person");

// If Else
let a = 10, b = 20
if (a > b)
    console.log("a is big");
else
    console.log("b is bigu");

//else if ladder
let m1 = 70, m2 = 73, m3 = 88;
let avg = (m1 + m2 + m3) / 3;
if (avg >= 75)
    console.log("Distinction")
else if (avg >= 60 && avg < 75)
    console.log("First Class");
else if (avg >= 50 && avg < 60)
    console.log("Second Class");
else if (avg >= 40 && avg < 50)
    console.log("Third Class");
else
    console.log(fail);

//Nested if
let a1 = 60, b2 = 689, c3 = 30;
if (a1 > b2) {
    if (a1 > c3)
        console.log("a1 is big");
    else
        console.log("c3 is big");
}
else {
    if (b2 > c3)
        console.log("b1 is big");
    else
        console.log("c3 is big");

}