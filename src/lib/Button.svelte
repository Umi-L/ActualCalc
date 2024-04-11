<script lang="ts">
    import {ButtonType} from "../ButtonType";
    import Icon from "@iconify/svelte";
    import {onMount} from "svelte";
    import {addCharacter} from "../Logic";

    export let type: ButtonType = ButtonType.Normal;
    export let icon: string | undefined = undefined;
    export let text: string | undefined = undefined;

    export let col: string = "";
    export let row: string = "";

    export let character: string | undefined = undefined;
    export let onClick: (() => void) | undefined = undefined


    let buttonElement: HTMLButtonElement;

    let pressed = false;


    onMount(() => {
        calculateBorderRadius();
        calculatePadding();

        window.addEventListener("mouseup", () => pressed = false);
        window.addEventListener("touchend", () => pressed = false);
        window.addEventListener("touchcancel", () => pressed = false);


        window.addEventListener("resize", () => {
            calculateBorderRadius();
            calculatePadding();
        });

        // on orientation change recalculate border radius
        window.addEventListener("orientationchange", () => {
            calculateBorderRadius();
            calculatePadding();
        });

        // on window focus recalculate border radius
        window.addEventListener("focus", () => {
            calculateBorderRadius();
            calculatePadding();
        });

        buttonElement.onresize = calculateBorderRadius;
    });

    function calculatePadding() {
        const width = buttonElement.offsetWidth;
        const height = buttonElement.offsetHeight;

        console.log("button?", width, height);

        const minSize = Math.min(width, height);

        // determine t value from 0 to 1 given max size of 500px
        let t = minSize / 100;

        // if > 1 clamp to 1
        if (t > 1) {
            t = 1;
        }

        let padding = cubicEaseOut(t) * 0.2 * minSize;

        if (padding > 20) {
            padding = 20;
        }

        // nonlinear padding
        buttonElement.style.padding = `${padding}px`;
    }

    function cubicEaseOut(t: number) {
        const t1 = t - 1;
        return t1 * t1 * t1 + 1;
    }

    function calculateBorderRadius() {
        // button radius is 50% when button width is equal to button height however when width or height are different the radius should become smaller
        const width = buttonElement.offsetWidth;
        const height = buttonElement.offsetHeight;

        const maxSize = Math.max(width, height);
        const radius = Math.min(width / height, height / width) * 0.5;

        buttonElement.style.borderRadius = `${radius * maxSize}px`;
    }

    function onMousedown() {
        pressed = true;
    }

    function onMouseup() {
        if (onClick) {
            onClick();
        }

        if (character) {
            addCharacter(character);
        }

        pressed = false;
    }
</script>

<div class="button-wrapper" style={`grid-column: ${col}; grid-row: ${row}`} class:blank={type === ButtonType.Blank}>

    <button class="button"

            class:normal={type === ButtonType.Normal}
            class:equals={type === ButtonType.Equals}
            class:operator={type === ButtonType.Operator}
            class:clear={type === ButtonType.Clear}
            class:blank={type === ButtonType.Blank}

            class:pressed={pressed}

            on:mousedown={onMousedown}
            on:mouseup={onMouseup}

            on:touchstart={(e)=>{onMousedown(); e.preventDefault()}}
            on:touchend={(e)=>{onMouseup(); e.preventDefault()}}

            bind:this={buttonElement}>

            {#if icon}
                <Icon {icon} class="button-icon"/>
            {:else if text}
                <svg viewBox="0 0 60 60" aria-hidden="true" role="img" class="svg iconify iconify--ph" width="1em"
                     height="1em" preserveAspectRatio="xMidYMid meet">
                    <text dominant-baseline="middle" text-anchor="middle" x="50%" y="50%" transform="translate"
                          font-size="2rem">{text}</text>
                </svg>
            {/if}
    </button>
</div>

<style>


    .button-wrapper {
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
    }

    .button {

        /*
        stupid hack
        https://stackoverflow.com/questions/8468066/child-inside-parent-with-min-height-100-not-inheriting-height
        */
        height: 1px;

        min-width: 100%;
        min-height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        color: var(--button-text-color);

        user-select: none;

        border: none;
        background-color: transparent;

        transition: border-radius 0.1s ease-out, filter 0.1s ease-out;
    }

    .pressed {
        border-radius: 10px !important;
        transition: 0.2s ease-in;

        /*  increase brightness by 20%  */
        filter: brightness(120%);
    }

    .button-wrapper {
        padding: 0.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button.normal {
        background-color: var(--button-color);
        fill: var(--button-text-color) !important;
        color: var(--button-text-color) !important;
    }

    .button.blank {
        margin: 0;
        fill: var(--button-text-color) !important;
        color: var(--button-text-color) !important;
    }

    .button.equals {
        background-color: var(--equals-color);
        fill: var(--button-text-color) !important;
        color: var(--button-text-color) !important;
    }

    .button.operator {
        background-color: var(--operator-color);

        fill: var(--button-text-color) !important;
        color: var(--button-text-color) !important;
    }

    .button.clear {
        background-color: var(--clear-color);

        fill: var(--clear-text-color) !important;
        color: var(--clear-text-color) !important;
    }

    :global(.button-icon) {
        width: auto;
        height: 100%;
    }

    .svg {
        width: auto;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
