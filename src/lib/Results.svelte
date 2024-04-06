<script lang="ts">
    import {onMount} from "svelte";
    import {currentCalculation, getDisplayString, prediction} from "../Logic";
    import History from "./History.svelte";

    export let row: string;
    export let col: string;

    let calculation: string;
    let predictiveResults: string;

    let mainResultsDiv: HTMLDivElement;
    let predictiveResultsDiv: HTMLDivElement;

    let mainResultsSpan: HTMLSpanElement;
    let predictiveResultsSpan: HTMLSpanElement;

    let container: HTMLDivElement;
    let resultsGridDiv: HTMLDivElement;

    let historyOpen = false;
    let dragging = false;

    let mainPanelHeight: number;

    onMount(() => {
        currentCalculation.subscribe(value => {
            calculation = getDisplayString(value);

            calculateFontSize();
        })

        prediction.subscribe(value => {
            predictiveResults = value;
        })

        calculateFontSize();

        window.addEventListener("resize", calculateFontSize);

        updateMainPanelHeight();

        // on drag
        resultsGridDiv.addEventListener("mousedown", (e) => {
            dragging = true;

            let prevX = e.clientX;
            let prevY = e.clientY;

            onDrag(prevX, prevY, e.clientX, e.clientY);

            const onMouseMove = (e: MouseEvent) => {
                onDrag(prevX, prevY, e.clientX, e.clientY);

                prevX = e.clientX;
                prevY = e.clientY;
            }

            const onMouseUp = () => {
                dragEnd(prevX, prevY);

                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
            }

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        })

        // on gesture
        resultsGridDiv.addEventListener("touchstart", (e) => {
            dragging = true;

            let prevX = e.touches[0].clientX;
            let prevY = e.touches[0].clientY;

            onDrag(prevX, prevY, e.touches[0].clientX, e.touches[0].clientY);

            const onTouchMove = (e: TouchEvent) => {
                onDrag(prevX, prevY, e.touches[0].clientX, e.touches[0].clientY);

                prevX = e.touches[0].clientX;
                prevY = e.touches[0].clientY;
            }

            const onTouchEnd = () => {
                dragEnd(prevX, prevY)

                window.removeEventListener("touchmove", onTouchMove);
                window.removeEventListener("touchend", onTouchEnd);
            }

            window.addEventListener("touchmove", onTouchMove);
            window.addEventListener("touchend", onTouchEnd);
        })
    });

    function onDrag(prevX: number, prevY: number, x: number, y: number) {
        let newTop = y;

        if (newTop < mainPanelHeight) {
            newTop = mainPanelHeight;
        }

        container.style.height = `${newTop}px`;
    }

    function dragEnd(prevX: number, prevY: number) {
        dragging=false;

        // if y is more than 1/3 of the way down the screen, open history
        if (prevY > window.innerHeight / 2) {
            historyOpen = true;
        } else {
            historyOpen = false;
        }

        // get dy
        let dy = prevY - container.clientHeight;

        // if velocity up is high and history is open, close it
        if (dy < -1 && historyOpen) {
            historyOpen = false;
        }

        console.log(dy);

        // clear top value
        container.style.height = "";
    }

    function updateMainPanelHeight() {
        mainPanelHeight = container.clientHeight;
    }

    function calculateFontSize() {

        // min font size is 1/2 of the height of the div
        const minFontSize = mainResultsDiv.clientHeight / 2;

        let mainFontSize = mainResultsDiv.clientHeight;
        let predictiveFontSize = predictiveResultsDiv.clientHeight;

        // determine how small the font size would need to be to fit span into div
        while (mainResultsSpan.scrollWidth > mainResultsDiv.clientWidth - 20) {
            mainFontSize -= 0.1;
            mainResultsDiv.style.fontSize = `${mainFontSize}px`;
        }

        while (predictiveResultsSpan.scrollWidth > predictiveResultsDiv.clientWidth - 20) {
            predictiveFontSize -= 0.1;
            predictiveResultsDiv.style.fontSize = `${predictiveFontSize}px`;
        }

        // console.log(mainFontSize, predictiveFontSize);

        // set font size to min font size if it is smaller than min font size
        mainFontSize = Math.max(mainFontSize, minFontSize);
        predictiveFontSize = Math.max(predictiveFontSize, minFontSize);

        mainResultsDiv.style.fontSize = `${mainFontSize}px`;
        mainResultsDiv.style.lineHeight = `${mainFontSize}px`;
        predictiveResultsDiv.style.fontSize = `${predictiveFontSize}px`;
        predictiveResultsDiv.style.lineHeight = `${predictiveFontSize}px`;
    }
</script>

<div class="results" style={`grid-column: ${col}; grid-row: ${row}`} bind:this={container}
     class:history-open={historyOpen && !dragging} class:dragging={dragging}>

    <div class="history-wrapper" class:hidden={!historyOpen}>
        <History/>
    </div>

    <div class="results-grid" style={(historyOpen || dragging) ? `height: ${mainPanelHeight}px;` : `height: 100%;`} bind:this={resultsGridDiv}>
        <div class="results-wrapper main-results">
            <div class="main-results" bind:this={mainResultsDiv}>
                <span bind:this={mainResultsSpan}>
                    {calculation}
                </span>
            </div>
        </div>

        <div class="predictive-results" bind:this={predictiveResultsDiv}>
            <span bind:this={predictiveResultsSpan}>
                {predictiveResults}
            </span>
        </div>
    </div>


    <div class="handle"></div>
</div>

<style>
    .results {
        width: 100%;
        height: 100%;

        /*  round only bottom two corners  */
        border-radius: 0 0 25px 25px;

        background-color: var(--history-color);

        position: relative;

        font-family: "Roboto", sans-serif;
        font-weight: 500;
        font-style: normal;

        /*  gap between letters  */
        letter-spacing: 0.1rem;

        z-index: 1;

        display: flex;
        flex-direction: column;
        justify-content: end;

        overflow: hidden;

        top:0;
    }

    .results-grid {
        display: grid;

        /*  1 row takes 50% and the other 2 take 25%  */
        grid-template-rows: 30% 30% 20% 10%;

        background-color: var(--results-color);
    }

    .main-results {
        grid-row: 2 / 3;
        width: 100%;
        height: 100%;

        text-align: right;
        text-wrap: none;
        white-space: nowrap;
    }

    .results-wrapper {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        padding-left: 1rem;
        padding-right: 1rem;

        overflow-x: auto;
        overflow-y: hidden;
    }

    .predictive-results {
        grid-row: 3 / 4;
        width: 100%;
        height: 100%;

        color: var(--button-text-color);

        text-align: right;

        text-overflow: ellipsis;

        white-space: nowrap;
        overflow: hidden;

        padding-left: 2rem;
    }

    .handle {

        position: absolute;

        /*place bottom center*/
        left: 50%;
        transform: translateX(-50%);
        bottom: 2%;

        width: 1.5rem;
        height: 4px;
        border-radius: 2px;

        background-color: var(--button-text-color);

        user-select: none;
        pointer-events: none;
    }

    .history-open {
        position: fixed;
        height: 75% !important;

        transition: 0.1s;
    }

    .dragging {
        position: fixed;
    }

    .history-wrapper{
        width: 100%;
        height: 100%;
    }

    .hidden{
        display: none;
    }
</style>