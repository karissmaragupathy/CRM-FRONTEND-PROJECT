function sayHello() {
    console.log("Hello");
}
function execute(fn) {
    fn();
}
execute(sayHello);


function add() {
    console.log("adding");
}
function subtract() {
    console.log("subtracting");

}
function doAdd() {
    add();
}
function doSub() {
    subtract();
}
doAdd();
doSub();