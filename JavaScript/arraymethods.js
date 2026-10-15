// 1. Initialize
let numbers = [1, 2, 3, 4, 5];
console.log(numbers); // [1, 2, 3, 4, 5]

// 2. push: add to the end
numbers.push(23);
console.log(numbers); // [1, 2, 3, 4, 5, 23]

// 3. pop: remove from the end
numbers.pop();
console.log(numbers); // [1, 2, 3, 4, 5]

// 4. shift: remove from the start
numbers.shift();
console.log(numbers); // [2, 3, 4, 5]

// 5. unshift: add to the start
numbers.unshift(10);
console.log(numbers); // [10, 2, 3, 4, 5]

// 6. concat: merge arrays into a new array
const num2 = [23, 24, 25];
let result = numbers.concat(num2);
console.log(result); // [10, 2, 3, 4, 5, 23, 24, 25]

// 7. slice: extract a sub-array (start index to end index - 1, non-mutating)
console.log(numbers.slice(1, 3)); // [2, 3]

// 8. splice: delete / replace elements in-place (index, deleteCount)
numbers.splice(1, 2); // removes 2 and 3
console.log(numbers); // [10, 4, 5]

// 9. indexOf: find index of an exact value (-1 if absent)
console.log(numbers.indexOf(4)); // 1

// 10. forEach: execute a function for each element
numbers.forEach((n) => {
    console.log(n); // logs 10, then 4, then 5
});

// 11. map: transform every element into a new array
let squares = numbers.map((n) => n * n);
console.log(squares); // [100, 16, 25]

// 12. filter: return all elements matching a condition
let evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [10, 4]

// 13. find: return the first element matching a condition
let firstOverFive = numbers.find((n) => n > 5);
console.log(firstOverFive); // 10

// 14. findIndex: return the index of the first match
let firstOverFiveIndex = numbers.findIndex((n) => n > 5);
console.log(firstOverFiveIndex); // 0

// 15. reduce: aggregate elements into a single value (e.g., sum)
let totalSum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(totalSum); // 19

// 16. sort: sort elements in-place using a comparator
numbers.sort((a, b) => a - b);
console.log(numbers); // [4, 5, 10]

// 17. reverse: invert array order in-place
numbers.reverse();
console.log(numbers); // [10, 5, 4]

// 18. join: convert array into a separated string
let joinedString = numbers.join(' - ');
console.log(joinedString); // "10 - 5 - 4"