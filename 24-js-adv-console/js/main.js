// URL - https://medium.freecodecamp.org/how-to-get-the-most-out-of-the-javascript-console-b57ca9db3e6d
// URL - https://developer.mozilla.org/en-US/docs/Web/API/console

// 01 - Simple
window.console.log("This works");
console.log("So does this");


console.log('***********************');


// 02 - Substitutions

// String - %s
console.log('string %s', 'substitutions');

// Object - %o or %0
console.log("this is an object %o", { obj: { obj2: "hello" } });

// Number - %i or %f
console.log("int: %d, floating-point: %f", 1, 1.5);

// formatted the above example to display one digit after the decimal point for the floating-point number
console.log("int: %d, floating-point: %.1f", 1, 1.5);


console.log("***********************");


// 03 - String Templates
const a = "substitutions";
console.log(`bear: ${a}`);

console.log("***********************");


// 04 - Pretty color interlude!
const success = [
  "background: green",
  "color: white",
  "display: block",
  "text-align: center"
].join(";");
const failure = [
  "background: red",
  "color: white",
  "display: block",
  "text-align: center"
].join(";");
console.info("%c /dancing/bears was Successful!", success);
console.log({
  data: {
    name: "Bob",
    age: "unknown"
  }
}); // "mocked" data response
console.error("%c /dancing/bats failed!", failure);
console.log("/dancing/bats Does not exist");

console.log("***********************");


// 05 - Other available methods

// Assert() - Assert takes two arguments — if the first argument evaluates to a falsy value, then it displays the second argument.
let isTrue = false;
console.assert(isTrue, "This will display");
isTrue = true;
console.assert(isTrue, "This will not");

console.log("***********************");

// Dir() - The dir method displays an interactive list of the object passed to it.
console.log(document.body);
console.dir(document.body);

console.log("***********************");

// Table() - The table method displays an array or object as a table.
console.table(["Javascript", "PHP", "Perl", "C++"]);

var superhero = {
  firstname: "Peter",
  lastname: "Parker"
};
console.table(superhero);

console.log("***********************");

// For Chrome
console.table([["Javascript", "PHP", "Perl", "C++"]]);
var superhero = {
  firstname: "Peter",
  lastname: "Parker"
};
console.table([superhero]); 

console.log("***********************");

// Group() - console.group() is made up of at least a minimum of three console calls, and is probably the method that requires the most typing to use.
console.group();
console.log("I will output");
console.group();
console.log("more indents");
console.groupEnd();
console.log("ohh look a bear");
console.groupEnd();

// console.group("Header");
// console.groupCollapsed();

console.log("***********************");

// Time() - 

console.time("id for timer");
console.timeEnd("id for timer");

console.log("***********************");


// Trace()
function foo() {
  function bar() {
    console.trace();
  }
  bar();
}

foo();

console.log("***********************");