<script lang="ts">
    import Button from "./lib/Button.svelte";
    import {onMount} from "svelte";
    import {Orientation} from "./Orientation";
    import {ButtonType} from "./ButtonType";
    import Results from "./lib/Results.svelte";
    import {addBracket, angleMode, calculate, clear, removeCharacter, toggleAngleMode} from "./Logic";

    import OperatorPanel from "./lib/OperatorPanel.svelte";

    let orientation: Orientation;

    let calcDiv: HTMLDivElement;
    let dropdownVisible = false;
    let inverse = false;

    let angleModeValue: string;
    angleMode.subscribe(value => {
        angleModeValue = value.toUpperCase();
    })

    onMount(() => {
        windowResize();

        // register event listener
        window.addEventListener("resize", windowResize);
        window.addEventListener("orientationchange", windowResize);

        updateColorScheme();

        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', ({matches}) => {
                updateColorScheme();
            })
    });

    function updateColorScheme() {
        // get --foreground-color value
        const foregroundColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground-color');

        document.querySelector('meta[name="theme-color"]')!.setAttribute('content', foregroundColor);
    }

    function windowResize() {
        // calculate orientation
        orientation = window.innerWidth > window.innerHeight ? Orientation.Landscape : Orientation.Portrait;
    }

    // this sucks but needs to be done for safari to be happy :(
    let calcCol1 = "1/6";
    let calcCol2 = "6/11";
    let calcCol3 = "11/16";
    let calcCol4 = "16/21";

    let operatorPanelCol1 = "1/5";
    let operatorPanelCol2 = "5/9";
    let operatorPanelCol3 = "9/13";
    let operatorPanelCol4 = "13/17";
    let operatorPanelCol5 = "17/21";
</script>


<div class="calc-wrapper">
    <div class="calc" bind:this={calcDiv}>

        <Results col={calcCol1} row="1 / -7"/>


        <div class="buttons" class:expanded={dropdownVisible}>
            <Button icon="ph:number-zero" col={calcCol1} row="-1/-2" character="0"/>
            <Button icon="ph:dot-outline-fill" col={calcCol2} row="-1/-2" character="."/>
            <Button icon="ph:backspace" col={calcCol3} row="-1/-2" onClick={()=>{removeCharacter()}}/>
            <Button icon="ph:equals" col={calcCol4} row="-1/-2" type={ButtonType.Equals} onClick={()=>{calculate()}}/>

            <!--    1, 2, 3, +    -->
            <Button icon="ph:number-one" col={calcCol1} row="-2/-3" character="1"/>
            <Button icon="ph:number-two" col={calcCol2} row="-2/-3" character="2"/>
            <Button icon="ph:number-three" col={calcCol3} row="-2/-3" character="3"/>
            <Button icon="ph:plus" col={calcCol4} row="-2/-3" character="+" type={ButtonType.Operator}/>

            <!--    4, 5, 6, -    -->
            <Button icon="ph:number-four" col={calcCol1} row="-3/-4" character="4"/>
            <Button icon="ph:number-five" col={calcCol2} row="-3/-4" character="5"/>
            <Button icon="ph:number-six" col={calcCol3} row="-3/-4" character="6"/>
            <Button icon="ph:minus" col={calcCol4} row="-3/-4" type={ButtonType.Operator} character="-"/>

            <!--    7, 8, 9, *    -->
            <Button icon="ph:number-seven" col={calcCol1} row="-4/-5" character="7"/>
            <Button icon="ph:number-eight" col={calcCol2} row="-4/-5" character="8"/>
            <Button icon="ph:number-nine" col={calcCol3} row="-4/-5" character="9"/>
            <Button icon="ph:x" col={calcCol4} row="-4/-5" type={ButtonType.Operator} character="*"/>

            <!--    Clear, (), %, divide    -->
            <Button text="AC" col={calcCol1} row="-5/-6" type={ButtonType.Clear} onClick={()=>{clear()}}/>
            <Button icon="ph:brackets-round" col={calcCol2} row="-5/-6" type={ButtonType.Operator}
                    onClick={()=>{addBracket()}}/>
            <Button icon="ph:percent" col={calcCol3} row="-5/-6" type={ButtonType.Operator} character="%"/>
            <Button icon="ph:divide" col={calcCol4} row="-5/-6" type={ButtonType.Operator} character="/"/>


            <Button icon="tabler:square-root" row="1/2" col={operatorPanelCol1} type={ButtonType.Blank} character="√"/>
            <Button icon="ph:pi" row="1/2" col={operatorPanelCol2} type={ButtonType.Blank} character="π"/>
            <Button icon="ri:arrow-drop-up-line" row="1/2" col={operatorPanelCol3} type={ButtonType.Blank}
                    character="^"/>
            <Button icon="ph:exclamation-mark" row="1/2" col={operatorPanelCol4} type={ButtonType.Blank} character="!"/>

            <Button icon={dropdownVisible ? "ph:arrow-bend-right-up" : "ph:arrow-bend-right-down"} row="1/2"
                    col={operatorPanelCol5}
                    type={ButtonType.Blank} onClick={()=>{dropdownVisible=!dropdownVisible}}/>

            {#if dropdownVisible}
                <Button text={angleModeValue} row="2/3" col={operatorPanelCol1} type={ButtonType.Blank}
                        onClick={()=>{toggleAngleMode()}}/>
                <Button text="INV" row="3/4" col={operatorPanelCol1} type={ButtonType.Blank}
                        onClick={()=>{inverse=!inverse}}/>
                <Button text="e" row="3/4" col={operatorPanelCol2} type={ButtonType.Blank} character="e"/>

                {#if !inverse}
                    <Button text="sin" row="2/3" col={operatorPanelCol2} type={ButtonType.Blank} character="s"/>
                    <Button text="cos" row="2/3" col={operatorPanelCol3} type={ButtonType.Blank} character="c"/>
                    <Button text="tan" row="2/3" col={operatorPanelCol4} type={ButtonType.Blank} character="t"/>

                    <Button text="ln" row="3/4" col={operatorPanelCol3} type={ButtonType.Blank} character="l"/>
                    <Button text="log" row="3/4" col={operatorPanelCol4} type={ButtonType.Blank} character="g"/>
                {:else}
                    <Button text="asin" row="2/3" col={operatorPanelCol2} type={ButtonType.Blank} character="S"/>
                    <Button text="acos" row="2/3" col={operatorPanelCol3} type={ButtonType.Blank} character="C"/>
                    <Button text="atan" row="2/3" col={operatorPanelCol4} type={ButtonType.Blank} character="T"/>

                    <Button text="eˣ" row="3/4" col={operatorPanelCol3} type={ButtonType.Blank} character="E"/>
                    <Button text="10ˣ" row="3/4" col={operatorPanelCol4} type={ButtonType.Blank} character="G"/>
                {/if}


            {/if}
        </div>

    </div>
</div>

<style>
    .calc-wrapper {
        width: 100%;
        height: 100%;
    }

    .buttons {

        grid-row: -1/-7;
        grid-column: 1 / 5;

        display: grid;
        grid-template-columns: repeat(20, 1fr);
        grid-template-rows: repeat(6, 1fr);
        padding: 0;

        width: 100%;
        height: 100%;

        max-height: 100%;
    }

    .expanded {
        grid-template-rows: repeat(8, 1fr);
    }

    .calc {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(9, 1fr);
        padding: 0;

        width: 100%;
        height: 100%;
    }
</style>
