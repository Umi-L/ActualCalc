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


    let buttonDiv: HTMLDivElement;

    let childElementWrapper: HTMLElement | undefined;


    onMount(() => {
        calculateBorderRadius();
        calculateIconSize();

        window.addEventListener("resize", calculateBorderRadius);
        window.addEventListener("resize", calculateIconSize);

        buttonDiv.onclick = () => {
            if (onClick) {
                onClick();
            }

            if (character) {
                addCharacter(character);
            }
        };
    });

    function calculateIconSize() {
        if (childElementWrapper) {

            const childElement = childElementWrapper.children[0] as HTMLElement;

            const width = buttonDiv.offsetWidth;
            const height = buttonDiv.offsetHeight;

            const maxSize = Math.min(width, height);

            childElement.style.width = `${maxSize * 0.5}px`;
            childElement.style.height = `${maxSize * 0.5}px`;
        }
    }

    function calculateBorderRadius() {
        // button radius is 50% when button width is equal to button height however when width or height are different the radius should become smaller
        const width = buttonDiv.offsetWidth;
        const height = buttonDiv.offsetHeight;

        const maxSize = Math.max(width, height);
        const radius = Math.min(width / height, height / width) * 0.5;

        buttonDiv.style.borderRadius = `${radius * maxSize}px`;
    }
</script>

<div class="button-wrapper" style={`grid-column: ${col}; grid-row: ${row}`} class:blank={type === ButtonType.Blank}>
    <div class="button"

         class:normal={type === ButtonType.Normal}
         class:equals={type === ButtonType.Equals}
         class:operator={type === ButtonType.Operator}
         class:clear={type === ButtonType.Clear}
         class:blank={type === ButtonType.Blank}

         bind:this={buttonDiv}>

        {#if icon}
            <Icon {icon} class="button-icon"/>
        {:else if text}
            <div class="svg-wrapper" bind:this={childElementWrapper}>
                <svg viewBox="0 0 60 60" width="100%" height="100%">
                    <text dominant-baseline="middle" text-anchor="middle" x="50%" y="50%" font-size="2rem">{text}</text>
                </svg>
            </div>
        {:else}
            <div class="svg-wrapper" bind:this={childElementWrapper}>
                <slot/>
            </div>
        {/if}
    </div>
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
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        padding: 1rem;

        color: var(--button-text-color);

        user-select: none;
    }

    /* on held down */
    .button:active {
        border-radius: 10px !important;
        transition: 0.1s;
    }

    .button-wrapper {
        padding: 0.5rem;
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

    .svg-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
