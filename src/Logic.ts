import {type Writable, writable} from "svelte/store";
import {all, create, log, typed} from "mathjs";
import {Abbreviations} from "./Abbreviations";

const MathEngine = create(all);

export let angleMode = writable("rad");
let angleModeValue: string = "rad";

export interface Calculation {
    calculation: string;
    result: string;
    date: Date;
}

export let history: Writable<Array<Calculation>> = writable([]);

history.subscribe((value) => {
    if (value == null || value.length === 0)
        return

    console.log("History wrote", value);

    // write to local storage
    localStorage.setItem("history", JSON.stringify(value));
});

// load history from local storage
let historyValue = localStorage.getItem("history");
console.log("History read", historyValue);
if (historyValue != null) {
    history.set(JSON.parse(historyValue));
}

// load angle mode from local storage
let angleModeValueLocal = localStorage.getItem("angleMode");
console.log("Angle mode read", angleModeValueLocal);
if (angleModeValueLocal != null) {
    angleMode.set(angleModeValueLocal);
}

angleMode.subscribe((value) => {
    angleModeValue = value;
    console.log("Angle mode", value);
    localStorage.setItem("angleMode", value);
});

function replaceFunctions() {

    let replacements: any = {};

    // create ln function
    replacements["ln"] = typed("ln", {
        'number': log,
        'Array | Matrix': function (x) {
            return MathEngine.map(x, log)
        }
    })

    // make log function use base 10
    replacements["log"] = typed("log", {
        'number': function (x) {
            return log(x) / log(10)
        },
        'Array | Matrix': function (x) {
            return MathEngine.map(x, function (xi) {
                return log(xi) / log(10)
            })
        }
    })

    // create trigonometric functions replacing the input depending on angle config
    const fns1 = ['sin', 'cos', 'tan', 'sec', 'cot', 'csc']
    fns1.forEach(function (name) {
        // @ts-ignore
        const fn = MathEngine[name] // the original function

        const fnNumber = function (x: number) {
            // convert from configured type of angles to radians
            switch (angleModeValue) {
                case 'deg':
                    return fn(x / 360 * 2 * Math.PI)
                case 'grad':
                    return fn(x / 400 * 2 * Math.PI)
                default:
                    return fn(x)
            }
        }

        // create a typed-function which check the input types
        replacements[name] = typed(name, {
            'number': fnNumber,
            'Array | Matrix': function (x) {
                return MathEngine.map(x, fnNumber)
            }
        })
    })

    // create trigonometric functions replacing the output depending on angle config
    const fns2 = ['asin', 'acos', 'atan', 'atan2', 'acot', 'acsc', 'asec']
    fns2.forEach(function (name) {
        // @ts-ignore
        const fn = MathEngine[name] // the original function

        const fnNumber = function (x: number) {
            const result = fn(x)

            if (typeof result === 'number') {
                // convert to radians to configured type of angles
                switch (angleModeValue) {
                    case 'deg':
                        return result / 2 / Math.PI * 360
                    case 'grad':
                        return result / 2 / Math.PI * 400
                    default:
                        return result
                }
            }

            return result
        }

        // create a typed-function which check the input types
        replacements[name] = typed(name, {
            'number': fnNumber,
            'Array | Matrix': function (x) {
                return MathEngine.map(x, fnNumber)
            }
        })
    })

    MathEngine.import(replacements, {override: true})
}

replaceFunctions();

export let currentCalculation = writable("");
export let prediction = writable("");

let currentCalculationValue: string = "";

export let selectionStart: number = 0;
export let selectionEnd: number = 0;

currentCalculation.subscribe(calculationString => {
    console.log("Calculation", calculationString);
    console.log("Tokenized", getTokenizedDisplayString(calculationString));
    console.log("start, end", selectionStart, selectionEnd);

    // calculate prediction
    try {
        let predictionValue = evaluateString(calculationString);
        let predictionString = predictionValue.toString();

        if (predictionString === calculationString) {
            prediction.update(() => {
                return "";
            });
        } else if (predictionString == getFixedEvaluationString(calculationString)) {
            prediction.update(() => {
                return "";
            });
        } else {
            prediction.update(() => {
                return predictionString;
            });
        }
    } catch (e) {
        prediction.update(() => {
            return "";
        });
    }

    currentCalculationValue = calculationString;
});

export function evaluateString(string: string) {
    let evaluationString = getFixedEvaluationString(string);

    console.log("To eval", evaluationString);

    let result = MathEngine.evaluate(evaluationString);

    // if is parsable as a float && isnt an integer
    if (!isNaN(parseFloat(result)) && !Number.isInteger(result)) {
        result = strip(result);
    }

    return result;
}

function strip(number: string) {
    let result = (parseFloat(number).toPrecision(12));

    // round by last decimal
    result = result.replace(/(\d+\.\d*?[1-9])0+$/, "$1");

    // remove trailing zeros
    result = result.replace(/0+$/, "");

    return result;
}


export function addCharacter(character: string) {

    currentCalculation.update((currentCalculationValue) => {
        // insert character at cursor position if start and end are the same
        return currentCalculationValue.substring(0, selectionStart) + character + currentCalculationValue.substring(selectionEnd);
    });

    selectionStart++;
    selectionEnd = selectionStart;
}

export function removeCharacter() {

    if (selectionStart === 0) {
        return;
    }

    if (currentCalculationValue.length === 0) {
        return;
    }

    currentCalculation.update((currentCalculationValue) => {
        return currentCalculationValue.substring(0, selectionStart - 1) + currentCalculationValue.substring(selectionEnd);
    });

    selectionStart--;
    selectionEnd = selectionStart;
}

export function calculate() {
    let result = evaluateString(currentCalculationValue);

    if (result === undefined) {
        return;
    }

    let equation = currentCalculationValue;
    let date = new Date();

    // set calculation to result
    currentCalculation.set(result.toString());

    // add to history
    history.update((history) => {
        return [...history, {calculation: equation, result: result.toString(), date: date}];
    });

    // set selection to end of calculation
    selectionStart = currentCalculationValue.length;
    selectionEnd = selectionStart;
}

export function clear() {
    currentCalculation.update(() => {
        return "";
    });

    selectionStart = 0;
    selectionEnd = 0;
}

function getEvaluationString(string: string) {
    let evaluationString = string;

    let regex = new RegExp(Abbreviations.map(r => r.abbreviation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|"), "g");

    evaluationString = evaluationString.replace(regex, function (match: any) {
        let replacement = Abbreviations.find(r => r.abbreviation === match);
        return replacement ? replacement.calculation : match;
    });

    return evaluationString;
}

function getFixedEvaluationString(string: string) {
    let evaluationString = getEvaluationString(string);

    let openBrackets = (evaluationString.match(/\(/g) || []).length;
    let closeBrackets = (evaluationString.match(/\)/g) || []).length;

    // remove last character if it is an operator
    if (["+", "-", "*", "/", "^"].includes(evaluationString.charAt(evaluationString.length - 1))) {
        evaluationString = evaluationString.substring(0, evaluationString.length - 1);
    }

    // add closing brackets if there are more open brackets than close brackets
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
        evaluationString += ")";
    }

    return evaluationString;
}

export function getDisplayString(string: string) {
    return getTokenizedDisplayString(string).join("");
}

export function getTokenizedDisplayString(string: string) {
    // split string into array of characters
    let characters = string.split("");

    let regex = new RegExp(Abbreviations.map(r => r.abbreviation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|"), "g");

    // replace abbreviations with their display value
    return characters.map(character => {
        return character.replace(regex, function (match: any) {
            let replacement = Abbreviations.find(r => r.abbreviation === match);
            return replacement ? replacement.display : match;
        });
    });
}

export function addBracket() {
    let evaluationString = getEvaluationString(currentCalculationValue);

    let openBrackets = (evaluationString.match(/\(/g) || []).length;
    let closeBrackets = (evaluationString.match(/\)/g) || []).length;

    // if there are more open brackets than close brackets and previous character is not an opening bracket
    if (openBrackets > closeBrackets && currentCalculationValue.charAt(selectionStart - 1) !== "(") {
        addCharacter(")");
    } else {
        addCharacter("(");
    }
}

export function toggleAngleMode() {
    angleMode.update((value) => {
        return value === "rad" ? "deg" : "rad";
    });

    console.log("Angle mode", angleModeValue);

    // update calculation to reflect new angle mode kinda hacky
    let tmp = currentCalculationValue;
    currentCalculation.set("");
    currentCalculation.set(tmp);
}

export function addStringAtCursor(string: string){
    currentCalculation.update((currentCalculationValue) => {
        return currentCalculationValue.substring(0, selectionStart) + string + currentCalculationValue.substring(selectionEnd);
    });

    selectionStart += string.length;
    selectionEnd = selectionStart;
}

export function setSelection(start: number, end: number){
    selectionStart = start;
    selectionEnd = end;
}

export function caretLeft(){
    selectionStart--;
    selectionEnd = selectionStart;

    if (selectionStart < 0){
        selectionStart = 0;
    }

    // update calculation to refresh cursor
    let tmp = currentCalculationValue;
    currentCalculation.set("");
    currentCalculation.set(tmp);
}

export function caretRight(){
    selectionStart++;

    if (selectionStart > currentCalculationValue.length){
        selectionStart = currentCalculationValue.length;
    }

    selectionEnd = selectionStart;

    // update calculation to refresh cursor
    let tmp = currentCalculationValue;
    currentCalculation.set("");
    currentCalculation.set(tmp);
}