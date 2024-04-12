import {addCharacter, calculate, caretLeft, caretRight, removeCharacter} from "./Logic";

export function registerHotkeys(){
    window.addEventListener("keydown", (event) => {
        // 0-9
        if (event.key >= "0" && event.key <= "9") {
            addCharacter(event.key);
        }

        // decimal point
        if (event.key === ".") {
            addCharacter(".");
        }

        // operators
        if (event.key === "+") {
            addCharacter("+");
        }

        if (event.key === "-") {
            addCharacter("-");
        }

        if (event.key === "*") {
            addCharacter("*");
        }

        if (event.key === "/") {
            addCharacter("/");
        }

        // parentheses
        if (event.key === "(") {
            addCharacter("(");
        }

        if (event.key === ")") {
            addCharacter(")");
        }

        // backspace
        if (event.key === "Backspace") {
            removeCharacter();
        }

        // enter
        if (event.key === "Enter") {
            calculate();
        }

        // left arrow
        if (event.key === "ArrowLeft") {
            caretLeft();
        }

        // right arrow
        if (event.key === "ArrowRight") {
            caretRight();
        }

        // !
        if (event.key === "!") {
            addCharacter("!");
        }

        // ^
        if (event.key === "^") {
            addCharacter("^");
        }

        // %
        if (event.key === "%") {
            addCharacter("%");
        }

        // sin, cos, tan
        if (event.key === "s") {
            addCharacter("s");
        }

        if (event.key === "c") {
            addCharacter("c");
        }

        if (event.key === "t") {
            addCharacter("t");
        }
    });
}