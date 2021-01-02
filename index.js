const ADDITION = 'add';
const SUBTRACTION = 'subtract';
const DIVISION = 'divide';
const MULTIPLICATION = 'multiply';

// screen one 
const screen_1 = document.getElementById('screen_1');
// screen two
const screen_2 = document.getElementById('screen_2');
// keep track of decimal
let dec = false;

let x = null;
let y = null;
let operation = null;

// Toggling theme 
function toggleTheme() {
     const body = document.getElementsByTagName('body');

     if(body[0].dataset.theme === undefined) {
               body[0].setAttribute('data-theme', 'dark');
               document.getElementById('theme-toggler').innerText = 'Dark Mode';
          } else {
               document.getElementById('theme-toggler').innerText = 'Light Mode';
               body[0].removeAttribute('data-theme');
     }
}

// clear output
function clearOutput() {
     screen_1.innerText = '0';
     screen_2.innerText = '';
     dec = false;
     x = null;
     y = null;
     operation = null;
}

// backspace, remove last character 
function backspace() {
     const str = screen_1.innerText;
     // If screen is empty, do nothing
     if(str === '0') return;
     // if deleted character is decimal then set 'dec as false'
     if(str.charAt(str.length - 1) === '.') dec = false;
     // if only one character in screen_1 then clearOutput
     if(str.length === 1) { 
          !screen_2.innerHTML? clearOutput() : screen_1.innerText = str.slice(0, str.length - 1);
     } else if(str.length === 0) {
          clearOutput()
     } else {
          screen_1.innerText = str.slice(0, str.length - 1)
     }
}

// display number
function displayNumber(num) {
     if(screen_1.innerText === 'NaN') clearOutput();
     if(screen_2.innerText && !operation) clearOutput();
     if(screen_1.innerText === '0') {
          screen_1.innerText = num;
     } else {
          screen_1.innerText = screen_1.innerText + num;
     }
}

function putDecimal() {
     if(!dec) {
          screen_1.innerText = screen_1.innerText + '.';
     }
     dec = true;
}

// Pure function
function operate(operation, x, y) {
     switch(operation) {
          case 'add': 
          return x + y;
          case 'subtract': 
          return x - y;
          case 'divide': 
          return x / y;
          case 'multiply': 
          return x * y;
     }
}

function handleEqual() {
     if(!operation && !x && !y ) {
          let temp = screen_1.innerText;
          clearOutput()
          screen_1.innerText = temp;
     }
     if(operation === null) return; 
     if(!screen_1.innerText) return;

     y = parseFloat(screen_1.innerText);
     screen_2.innerText = screen_2.innerText + ' ' + screen_1.innerText;
     screen_1.innerText = operate(operation, x, y);

     x = null;
     y = null;
     operation = null;
} 

function handleOperation(param) {  
     let symbol;
     // set symbol according to operation
     switch(param) {
          case 'add': 
          symbol = '+';
          break;
          case 'subtract': 
          symbol = '-';
          break;
          case 'divide': 
          symbol = '÷';
          break;
          case 'multiply': 
          symbol = '×';
          break;
     }
     // already an operation in queue
     if(operation) {
          // second value or y is ready
          if(screen_1.innerText) {
               // compute 
               handleEqual();
               // set next operation
               operation = param;
               // set computed value as x
               x = parseFloat(screen_1.innerText);
               // append new operations on previous operations to show on screen_2
               screen_2.innerText = screen_2.innerText + ' ' + symbol;
               // empty screen_1
               screen_1.innerText = ''; 
          } else { // screen_1 is empty; y is NaN, can't compute
               // current operation is ADDITION or SUBTRACTION then change operation
               if(operation === ADDITION || operation === SUBTRACTION) {
                    operation = param;
                    // also change operation shown in screen_2
                    const str = screen_2.innerText;
                    screen_2.innerText = str.slice(0, str.length - 1) + ' ' + symbol;
               } else { // current operation is MULTIPLICATION or DIVISION
                    // if param is SUBTRACTION then user wants to add negative value 
                    if(param === SUBTRACTION) { 
                         // Handle Negative value
                         screen_1.innerText = symbol;
                    } else {
                         // change current operation! 
                         operation = param;
                         // also change operation shown in screen_2
                         const str = screen_2.innerText;
                         screen_2.innerText = str.slice(0, str.length - 1) + ' ' + symbol;
                    }
               }
          }
     } else {
          // No operation in queue, set operation
          operation = param;
          // set x from screen_1
          x = parseFloat(screen_1.innerText);
          // show operation on screen_2
          screen_2.innerText =`${x} ${symbol} `;
          // empty screen_1
          screen_1.innerText = '';
     } 
}

// Keyboard keys handler 
function handleKeyboard(e) {
     console.log(e)

     e.key === 'Enter' && handleEqual();

     e.code === 'Delete' || e.code === 'Backspace' && backspace();

     if(e.keyCode > 47 && e.keyCode < 58){
          displayNumber(e.key);
          return;
     }

     switch(e.key) {
          case '/':
               handleOperation(DIVISION);
               return;
          case '*':
               handleOperation(MULTIPLICATION);
               return;
          case '-':
               handleOperation(SUBTRACTION);
               return;
          case '+':
               handleOperation(ADDITION);
               return;
          default:
               return;
     }

} 

// Set event Listeners

// For Theme toggler
document.getElementById('theme-toggler').addEventListener('click', toggleTheme);

// For All Number Button
const numbers = [...document.querySelectorAll('._num')];
numbers.map(num => {
     num.addEventListener('click', () => displayNumber(num.innerText));
})

// For Decimal button
document.getElementById('decimal').addEventListener('click', putDecimal);

// For AC button
document.getElementById('all-clear').addEventListener('click', clearOutput);

// For Backspace button
document.getElementById('backspace').addEventListener('click', backspace);

document.getElementById('divide').addEventListener('click', () => handleOperation(DIVISION));
document.getElementById('multiply').addEventListener('click', () => handleOperation(MULTIPLICATION));
document.getElementById('minus').addEventListener('click', () => handleOperation(SUBTRACTION));
document.getElementById('plus').addEventListener('click', () => handleOperation(ADDITION));
document.getElementById('equal').addEventListener('click', handleEqual);

// Handle keyboards events
window.addEventListener('keypress', handleKeyboard)