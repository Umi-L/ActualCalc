export interface Abbreviation {
    display: string;
    abbreviation: string;
    calculation: string;
}

export const Abbreviations: Array<Abbreviation> = [
    {
        display: "Sin(",
        abbreviation: "s",
        calculation: "sin("
    },
    {
        display: "Cos(",
        abbreviation: "c",
        calculation: "cos("
    },
    {
        display: "Tan(",
        abbreviation: "t",
        calculation: "tan("
    },
    // log
    {
        display: "Log(",
        abbreviation: "g",
        calculation: "log("
    },
    // ln
    {
        display: "Ln(",
        abbreviation: "l",
        calculation: "ln("
    },
    // sqrt
    {
        display: "√(",
        abbreviation: "√",
        calculation: "sqrt("
    },
    // pi
    {
        display: "π",
        abbreviation: "π",
        calculation: "pi"
    },
    // division
    {
        display: "÷",
        abbreviation: "/",
        calculation: "/"
    },
    // multiplication
    {
        display: "×",
        abbreviation: "*",
        calculation: "*"
    },
    // sin^-1
    {
        display: "Asin(",
        abbreviation: "S",
        calculation: "asin("
    },
    // cos^-1
    {
        display: "Acos(",
        abbreviation: "C",
        calculation: "acos("
    },
    // tan^-1
    {
        display: "Atan(",
        abbreviation: "T",
        calculation: "atan("
    },
]