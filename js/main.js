// Static operands, user can not input any other charecter outside of below array
const operands = ["0", "00", ".", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Static operators user can not input any other operators outside of below object.
const operators = {
  "+": "+",
  "-": "-",
  "*": "×",
  "/": "÷",
  "%": "%",
};

//Global memory variables sync with DOM for (mc, m+, m-, mr) operation
let memory = 0;
let hasMemory = false;

//Global input output variables sync with DOM
let input = "";
let output = "";

// Handling delete on backspace
function handleDelete(input) {
  if (input.length > 0) {
    input = input.substring(0, input.length - 1);
  }
  return input;
}

// Handling submit while pressing equal sign or enter button
function handleSubmit(input, output) {
  input = output;
  output = "";
  return input;
}

// Calculating engin based on input value;
function evalInput(input) {
  output = "";

  let hasOperator = /\D/.exec(input) == null ? false : true;
  let firstOperatorIndex = hasOperator ? /\D/.exec(input).index + 1 : null;
  let InputLength = input.length;
  input = input.replace(/×/g, "*");
  input = input.replace(/÷/g, "/");

  if (!(firstOperatorIndex < InputLength)) {
    output = "";
  } else if (input[InputLength - 1] in operators) {
    input = input.substring(0, InputLength - 1);
    output += eval(input);
  } else if (hasOperator) {
    output += eval(input);
  } else {
    output = "";
  }
  return output;
}

// Event handler funtion on keyboard input or mouse input;
function calculation(e) {
  // Default char variable for keyboard input.
  let char = e.key;

  // If event fired from mouse then char value change based on DOM element value;
  // and fire the native keyboard events excep memory operation
  // Memory operation only available via DOM events.
  if (e.type == "click") {
    switch (e.target.textContent) {
      case "÷":
        char = "/";
        break;
      case "×":
        char = "*";
        break;
      case "«":
        char = "Backspace";
        break;
      case "00":
        char = "00";
        break;
      case "c":
        input = "";
        output = "";
        break;
      case "=":
        char = "Enter";
        break;
      case "m+":
        handleMemory("plus");
        break;
      case "m-":
        handleMemory("substract");
        break;
      case "mr":
        handleMemory("read");
        break;
      case "mc":
        handleMemory("clear");
        break;
      default:
        char = e.target.textContent;
    }
  }

  // Checking and validating input output variable, input max lenght 32 chars
  if (input.length <= 32) {
    if (operands.includes(char)) {
      input += char;
      output = evalInput(input);
    } else if (char in operators) {
      input += operators[char];
    } else if (char == "=" || char == "Enter") {
      input = handleSubmit(input, output);
      output = "";
    } else if (char == "Backspace") {
      input = handleDelete(input);
      output = evalInput(input);
    }
  } else {
    input = handleDelete(input);
  }

  // DOM display update with input output memory variable
  let inputDisplay = document.querySelector(".calc-dis-in");
  let outputDisplay = document.querySelector(".calc-dis-out");
  let memoryIndicator = document.querySelector(".calc-dis-mi");
  let memoryDisplay = document.querySelector(".calc-dis-mo");
  inputDisplay.innerHTML = input;
  outputDisplay.innerHTML = output;
  if (hasMemory) {
    memoryIndicator.innerHTML = "M";
    memoryDisplay.innerHTML = memory;
  } else {
    memoryIndicator.innerHTML = "";
    memoryDisplay.innerHTML = "";
  }
}

// Handling memory operation via helper function
function handleMemory(mode) {
  output = Number(output);

  switch (mode) {
    case "plus":
      hasMemory = true;
      memory += output;
      break;
    case "substract":
      hasMemory = true;
      memory -= output;
      break;
    case "read":
      if (hasMemory) {
        input = String(memory);
        output = "";
      }

      break;
    case "clear":
      hasMemory = false;
      memory = 0;
      hasMemory = false;
      break;
  }
}

// Final task -- Adding events to the Keyboar and DOM elements

// Adding keyboard event listener
window.addEventListener("keydown", calculation);

// Adding DOM mouse event listener
let btns = document.querySelectorAll(".calc-btn");
for (btn of btns) {
  btn.addEventListener("click", calculation);
}
