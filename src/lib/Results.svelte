<script lang="ts">
    import {onMount} from "svelte";
    import {
        currentCalculation,
        getDisplayString, getTokenizedDisplayString,
        prediction,
        selectionEnd,
        selectionStart,
        setSelection
    } from "../Logic";
    import History from "./History.svelte";

    export let row: string;
    export let col: string;

    let calculation: string[] = [];
    let predictiveResults: string;

    let mainResultsDiv: HTMLDivElement;
    let predictiveResultsDiv: HTMLDivElement;

    let mainResultsInput: HTMLInputElement;
    let predictiveResultsSpan: HTMLSpanElement;

    let container: HTMLDivElement;
    let resultsGridDiv: HTMLDivElement;

    let caretDiv: HTMLDivElement;
    let caretVisible = false;

    let historyOpen = false;
    let dragging = false;

    let mainPanelHeight: number;

    onMount(() => {
        currentCalculation.subscribe(value => {
            calculation = getTokenizedDisplayString(value);

            requestAnimationFrame(
                () => {
                    calculateFontSize();
                    updateCaret(selectionStart, selectionEnd);
                }
            );
        })

        mainResultsInput.onscroll = () => {
            updateCaret(selectionStart, selectionEnd);
        }

        prediction.subscribe(value => {
            predictiveResults = value;
        })

        window.addEventListener("resize", () => {
            calculateFontSize();
            updateMainPanelHeight();
        });

        // on orientation change
        window.addEventListener("orientationchange", () => {
            calculateFontSize();
            updateMainPanelHeight();
        });

        calculateFontSize();
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
        dragging = false;

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

        let depth = 0;

        let mainResultsTextWidth = calculateTextInInputWidth(mainResultsInput, mainResultsInput.value);

        // set text to be the same width as the input
        mainResultsInput.style.fontSize = `${mainFontSize}px`;
        predictiveResultsDiv.style.fontSize = `${predictiveFontSize}px`;

        mainFontSize = adjustFontSize(mainResultsInput, mainResultsDiv, mainFontSize, minFontSize);

        predictiveFontSize = adjustFontSize(predictiveResultsSpan, predictiveResultsDiv, predictiveFontSize, minFontSize);

        // set font size to min font size if it is smaller than min font size
        mainFontSize = Math.max(mainFontSize, minFontSize);
        predictiveFontSize = Math.max(predictiveFontSize, minFontSize);

        mainResultsDiv.style.fontSize = `${mainFontSize}px`;
        mainResultsDiv.style.lineHeight = `${mainFontSize}px`;
        predictiveResultsDiv.style.fontSize = `${predictiveFontSize}px`;
        predictiveResultsDiv.style.lineHeight = `${predictiveFontSize}px`;
    }

    function adjustFontSize(inputElement: HTMLInputElement | HTMLSpanElement, container: HTMLDivElement, currentFontSize: number, minFontSize: number): number {
        let left = minFontSize, right = currentFontSize;
        while (right - left > 0.1) {
            let mid = (left + right) / 2;
            inputElement.style.fontSize = `${mid}px`;
            let textWidth = calculateTextInInputWidth(inputElement, inputElement instanceof HTMLInputElement ? inputElement.value : inputElement.innerText);
            if (textWidth > container.clientWidth - 20) {
                right = mid;
            } else {
                left = mid;
            }
        }
        return left;
    }

    function calculateTextInInputWidth(inputElement: HTMLElement, text: string): number {
        let tester = document.createElement("span");
        tester.classList.add("font-tester");
        tester.innerText = text;

        copyStyles(inputElement, tester)

        document.body.appendChild(tester);

        let width = tester.clientWidth;

        document.body.removeChild(tester);

        return width;
    }

    function copyStyles(sourceElement: HTMLElement, targetElement: HTMLElement) {
        const computedStyle = window.getComputedStyle(sourceElement);
        const importantProperties = [];

        // Loop through all computed properties
        for (let i = 0; i < computedStyle.length; i++) {
            const propertyName = computedStyle[i];
            const propertyValue = computedStyle.getPropertyValue(propertyName);

            // Check for "important" styles and store them separately
            if (propertyValue.endsWith('!important')) {
                importantProperties.push(`${propertyName}: ${propertyValue}`);
                continue;
            }

            targetElement.style.setProperty(propertyName, propertyValue);
        }

        // Apply "important" styles last to ensure they override others
        targetElement.setAttribute('style', `${targetElement.getAttribute('style')}; ${importantProperties.join(';')}`);
    }

    // takes position in tokenized string
    function updateCaret(start: number | null, end: number | null) {
        if (start == null || end == null) {
            return;
        }

        // set start and end to their positions in the tokenized string
        setSelection(start, end);

        // set start and end to their positions in the input based on their positions in the tokenized string
        start = calculation.slice(0, start).join("").length;
        end = calculation.slice(0, end).join("").length;

        if (start != end) {
            caretVisible = false;
            return;
        }

        caretVisible = true;

        let text = mainResultsInput.value.substring(0, start);
        let textWidth = calculateTextInInputWidth(mainResultsInput, text);
        let fullWidth = calculateTextInInputWidth(mainResultsInput, mainResultsInput.value);
        let right = fullWidth - textWidth;

        right -= (mainResultsInput.scrollWidth - mainResultsInput.offsetWidth) - mainResultsInput.scrollLeft;

        caretDiv.style.right = `${right}px`;
        caretDiv.style.height = mainResultsInput.style.fontSize;

        // reset animation
        caretDiv.style.animation = "none";
        void caretDiv.offsetWidth;
        caretDiv.style.animation = "";
    }

    function setCaret() {
        let inputStart = mainResultsInput.selectionStart;
        let inputEnd = mainResultsInput.selectionEnd;

        if (inputStart == null || inputEnd == null) {
            return;
        }

        // get the positions in the tokenized string from the positions in the input
        let start = 0;
        let end = 0;

        let startCharacterCount = 0;
        let endCharacterCount = 0;

        // for each token
        for (let i = 0; i < calculation.length; i++) {
            let token = calculation[i];

            let test = startCharacterCount + token.length/2;
            startCharacterCount += token.length;

            // if the start is in this token
            if (test >= inputStart) {
                start = i;
                break;
            }
        }

        // for each token
        for (let i = 0; i < calculation.length; i++) {
            let token = calculation[i];

            let test = endCharacterCount + token.length/2;
            endCharacterCount += token.length;

            // if the end is in this token
            if (test >= inputEnd) {
                end = i;
                break;
            }
        }

        // if inputStart is at the end of the input, set start to the last token
        if (inputStart == mainResultsInput.value.length) {
            start = calculation.length;
        }
        if (inputEnd == mainResultsInput.value.length) {
            end = calculation.length;
        }

        console.log(calculation);
        console.log("input starts", inputStart, inputEnd);
        console.log("calculated starts", start, end);

        updateCaret(start, end);
    }

    function onTapOnInput(e: TouchEvent) {
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;

        let rect = mainResultsInput.getBoundingClientRect();

        let left = rect.left;
        let right = rect.right;
        let top = rect.top;
        let bottom = rect.bottom;

        if (x < left || x > right || y < top || y > bottom) {
            return;
        }

        let width = right - left;
        let height = bottom - top;

        let xPercent = (x - left) / width;
        let yPercent = (y - top) / height;

        let position = Math.floor(xPercent * mainResultsInput.value.length);

        mainResultsInput.selectionStart = position;
        mainResultsInput.selectionEnd = position;

        setCaret();

        e.preventDefault()
    }

    let touchStartTime = new Date();

    function onTouchStart(e: TouchEvent) {
        touchStartTime = new Date();
    }

    function onTouchEnd(e: TouchEvent) {

        let touchEndTime = new Date();
        let timeDiff = touchEndTime.getTime() - touchStartTime.getTime();

        if (timeDiff < 200) {
            onTapOnInput(e);
        }
    }
</script>

<div class="results" style={`grid-column: ${col}; grid-row: ${row}`} bind:this={container}
     class:history-open={historyOpen && !dragging} class:dragging={dragging}>

    <div class="history-wrapper" class:hidden={!historyOpen && !dragging}>
        <History/>
    </div>

    <div class="results-grid" style={(historyOpen || dragging) ? `height: ${mainPanelHeight}px;` : `height: 100%;`}
         bind:this={resultsGridDiv}>

        <div class="current-expression-text" class:invisible={!historyOpen}>
            Current expression
        </div>

        <div class="results-wrapper main-results">
            <div class="main-results" bind:this={mainResultsDiv}>
                <input class="results-input" bind:this={mainResultsInput} on:keypress={setCaret} on:click={setCaret}
                       value={calculation.join("")} readonly/>
                <div class="caret" bind:this={caretDiv} class:hidden={!caretVisible}></div>
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

        top: 0;
    }

    .results-input {
        width: 100%;
        height: 100%;

        background-color: transparent;
        color: var(--text-color);
        border: none;

        font-weight: 500;
        font-style: normal;

        text-align: end;

        padding: 0;
        margin: 0;

        overflow-x: scroll;

        -webkit-appearance:none;
    }

    .results-input:focus {
        outline: none;
    }

    .current-expression-text {
        width: 100%;
        height: 100%;

        padding: 1rem;

        font-weight: 400;

        grid-row: 1/2;
        grid-column: 1/2;

        font-size: 1.2em;

        color: var(--button-text-color);

        opacity: 1;

        transition: 0.1s;
    }

    .results-grid {
        display: grid;

        /*  1 row takes 50% and the other 2 take 25%  */
        grid-template-rows: 30% 30% 20% 10%;

        background-color: var(--foreground-color);

        flex-grow: 0;
        flex-shrink: 0;
    }

    .main-results {
        grid-row: 2 / 3;
        width: 100%;
        height: 100%;

        text-align: right;
        text-wrap: none;
        white-space: nowrap;

        position: relative;
    }

    .results-wrapper {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        padding-left: 1rem;
        padding-right: 1rem;

        overflow-x: hidden;
        overflow-y: hidden;
    }

    .predictive-results {
        grid-row: 3 / 4;
        width: 100%;
        height: 100%;

        color: var(--button-text-color);

        text-align: right;

        white-space: nowrap;
        overflow: hidden;

        padding-left: 1rem;
        padding-right: 1rem;
    }

    .caret {
        position: absolute;
        width: 2px;
        top: 50%;
        transform: translateY(-50%);

        background-color: var(--clear-text-color);

        animation-delay: 2s;
        animation: caret-blink 1s infinite;
    }

    @keyframes caret-blink {
        0% {
            opacity: 1;
        }
        49.9% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
        99.9% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
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
        height: 90% !important;

        transition: 0.1s;
    }

    .dragging {
        position: fixed;
    }

    .history-wrapper {
        width: 100%;
        height: 100%;

        overflow: hidden;
    }

    .hidden {
        display: none;
    }

    .invisible {
        opacity: 0;
    }

    :global(.font-tester) {
        position: absolute !important;
        visibility: hidden !important;
        height: auto !important;
        width: auto !important;
        white-space: nowrap !important; /* Thanks to Herb Caudill comment */
    }
</style>