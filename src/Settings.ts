import {type Writable, writable} from "svelte/store";
import type {Calculation} from "./Logic";

export let angleMode = writable("rad");
export let history: Writable<Array<Calculation>> = writable([]);
export let trigFunctionsPrecision = 12;
export let trigFunctionsMaxValue = 1e10;

// load angle mode from local storage
let angleModeValueLocal = localStorage.getItem("angleMode");
console.log("Angle mode read", angleModeValueLocal);
if (angleModeValueLocal != null) {
    angleMode.set(angleModeValueLocal);
}

// on history change, write to local storage
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