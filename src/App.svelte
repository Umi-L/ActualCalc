<script lang="ts">
    import Button from "./lib/Button.svelte";
    import {onMount} from "svelte";
    import {Orientation} from "./Orientation";
    import {ButtonType} from "./ButtonType";
    import Results from "./lib/Results.svelte";
    import {addBracket, calculate, clear, removeCharacter, toggleAngleMode} from "./Logic";
    import {angleMode} from "./Settings";

    let orientation: Orientation;

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
        // calculate orientationbnbn b
        orientation = window.innerWidth > window.innerHeight ? Orientation.Landscape : Orientation.Portrait;
    }

    // this sucks but needs to be done for safari to be happy :(
    let calcCol1Vert = "1/6";
    let calcCol2Vert = "6/11";
    let calcCol3Vert = "11/16";
    let calcCol4Vert = "16/21";

    let operatorPanelCol1Vert = "1/5";
    let operatorPanelCol2Vert = "5/9";
    let operatorPanelCol3Vert = "9/13";
    let operatorPanelCol4Vert = "13/17";
    let operatorPanelCol5Vert = "17/21";

    let calcCol1Hor = "1/2";
    let calcCol2Hor = "2/3";
    let calcCol3Hor = "3/4";
    let calcCol4Hor = "4/5";
    let calcCol5Hor = "5/6";
    let calcCol6Hor = "6/7";
    let calcCol7Hor = "7/8";
    let calcCol8Hor = "8/9";
</script>


<div class="calc-wrapper">
    <div class="calc">
        <Results col="1/2" row="1 / 2"/>

        {#if orientation === Orientation.Portrait}
            <div class="buttons buttons-vertical" class:expanded={dropdownVisible}>
                <Button icon="ph:number-zero" col={calcCol1Vert} row="-1/-2" character="0"/>
                <Button icon="ph:dot-outline-fill" col={calcCol2Vert} row="-1/-2" character="."/>
                <Button icon="ph:backspace" col={calcCol3Vert} row="-1/-2" onClick={()=>{removeCharacter()}}/>
                <Button icon="ph:equals" col={calcCol4Vert} row="-1/-2" type={ButtonType.Equals}
                        onClick={()=>{calculate()}}/>

                <!--    1, 2, 3, +    -->
                <Button icon="ph:number-one" col={calcCol1Vert} row="-2/-3" character="1"/>
                <Button icon="ph:number-two" col={calcCol2Vert} row="-2/-3" character="2"/>
                <Button icon="ph:number-three" col={calcCol3Vert} row="-2/-3" character="3"/>
                <Button icon="ph:plus" col={calcCol4Vert} row="-2/-3" character="+" type={ButtonType.Operator}/>

                <!--    4, 5, 6, -    -->
                <Button icon="ph:number-four" col={calcCol1Vert} row="-3/-4" character="4"/>
                <Button icon="ph:number-five" col={calcCol2Vert} row="-3/-4" character="5"/>
                <Button icon="ph:number-six" col={calcCol3Vert} row="-3/-4" character="6"/>
                <Button icon="ph:minus" col={calcCol4Vert} row="-3/-4" type={ButtonType.Operator} character="-"/>

                <!--    7, 8, 9, *    -->
                <Button icon="ph:number-seven" col={calcCol1Vert} row="-4/-5" character="7"/>
                <Button icon="ph:number-eight" col={calcCol2Vert} row="-4/-5" character="8"/>
                <Button icon="ph:number-nine" col={calcCol3Vert} row="-4/-5" character="9"/>
                <Button icon="ph:x" col={calcCol4Vert} row="-4/-5" type={ButtonType.Operator} character="*"/>

                <!--    Clear, (), %, divide    -->
                <Button text="AC" col={calcCol1Vert} row="-5/-6" type={ButtonType.Clear} onClick={()=>{clear()}}/>
                <Button icon="ph:brackets-round" col={calcCol2Vert} row="-5/-6" type={ButtonType.Operator}
                        onClick={()=>{addBracket()}}/>
                <Button icon="ph:percent" col={calcCol3Vert} row="-5/-6" type={ButtonType.Operator} character="%"/>
                <Button icon="ph:divide" col={calcCol4Vert} row="-5/-6" type={ButtonType.Operator} character="/"/>


                <Button icon="tabler:square-root" row="1/2" col={operatorPanelCol1Vert} type={ButtonType.Blank}
                        character="√"/>
                <Button icon="ph:pi" row="1/2" col={operatorPanelCol2Vert} type={ButtonType.Blank} character="π"/>
                <Button icon="ri:arrow-drop-up-line" row="1/2" col={operatorPanelCol3Vert} type={ButtonType.Blank}
                        character="^"/>
                <Button icon="ph:exclamation-mark" row="1/2" col={operatorPanelCol4Vert} type={ButtonType.Blank}
                        character="!"/>

                <Button icon={dropdownVisible ? "ph:arrow-bend-right-up" : "ph:arrow-bend-right-down"} row="1/2"
                        col={operatorPanelCol5Vert}
                        type={ButtonType.Blank} onClick={()=>{dropdownVisible=!dropdownVisible}}/>

                {#if dropdownVisible}
                    <Button text={angleModeValue} row="2/3" col={operatorPanelCol1Vert} type={ButtonType.Blank}
                            onClick={()=>{toggleAngleMode()}}/>
                    <Button text="INV" row="3/4" col={operatorPanelCol1Vert} type={ButtonType.Blank}
                            onClick={()=>{inverse=!inverse}}/>
                    <Button text="e" row="3/4" col={operatorPanelCol2Vert} type={ButtonType.Blank} character="e"/>

                    {#if !inverse}
                        <Button text="sin" row="2/3" col={operatorPanelCol2Vert} type={ButtonType.Blank} character="s"/>
                        <Button text="cos" row="2/3" col={operatorPanelCol3Vert} type={ButtonType.Blank} character="c"/>
                        <Button text="tan" row="2/3" col={operatorPanelCol4Vert} type={ButtonType.Blank} character="t"/>

                        <Button text="ln" row="3/4" col={operatorPanelCol3Vert} type={ButtonType.Blank} character="l"/>
                        <Button text="log" row="3/4" col={operatorPanelCol4Vert} type={ButtonType.Blank} character="g"/>
                    {:else}
                        <Button text="asin" row="2/3" col={operatorPanelCol2Vert} type={ButtonType.Blank}
                                character="S"/>
                        <Button text="acos" row="2/3" col={operatorPanelCol3Vert} type={ButtonType.Blank}
                                character="C"/>
                        <Button text="atan" row="2/3" col={operatorPanelCol4Vert} type={ButtonType.Blank}
                                character="T"/>

                        <Button text="eˣ" row="3/4" col={operatorPanelCol3Vert} type={ButtonType.Blank} character="E"/>
                        <Button text="10ˣ" row="3/4" col={operatorPanelCol4Vert} type={ButtonType.Blank} character="G"/>
                    {/if}


                {/if}
            </div>

        {:else}
            <div class="buttons buttons-horizontal">
                <!--       RAD, Sqrt, Pi, 7, 8, 9, /, clear         -->
                <Button text={angleModeValue} col={calcCol1Hor} row="1/2" type={ButtonType.Blank}
                        onClick={()=>{toggleAngleMode()}}/>
                <Button icon="tabler:square-root" col={calcCol2Hor} row="1/2" type={ButtonType.Blank} character="√"/>
                <Button icon="ph:pi" col={calcCol3Hor} row="1/2" type={ButtonType.Blank} character="π"/>
                <Button icon="ph:number-seven" col={calcCol4Hor} row="1/2" character="7"/>
                <Button icon="ph:number-eight" col={calcCol5Hor} row="1/2" character="8"/>
                <Button icon="ph:number-nine" col={calcCol6Hor} row="1/2" character="9"/>
                <Button icon="ph:divide" col={calcCol7Hor} row="1/2" type={ButtonType.Operator} character="/"/>
                <Button text="AC" col={calcCol8Hor} row="1/2" type={ButtonType.Clear} onClick={()=>{clear()}}/>

                <!--       INV, ^, !, 4, 5, 6, *, ()         -->
                <Button text="INV" col={calcCol1Hor} row="2/3" type={ButtonType.Blank}
                        onClick={()=>{inverse=!inverse}}/>
                <Button icon="ri:arrow-drop-up-line" col={calcCol2Hor} row="2/3" type={ButtonType.Blank} character="^"/>
                <Button icon="ph:exclamation-mark" col={calcCol3Hor} row="2/3" type={ButtonType.Blank} character="!"/>
                <Button icon="ph:number-four" col={calcCol4Hor} row="2/3" character="4"/>
                <Button icon="ph:number-five" col={calcCol5Hor} row="2/3" character="5"/>
                <Button icon="ph:number-six" col={calcCol6Hor} row="2/3" character="6"/>
                <Button icon="ph:x" col={calcCol7Hor} row="2/3" type={ButtonType.Operator} character="*"/>
                <Button icon="ph:brackets-round" col={calcCol8Hor} row="2/3" type={ButtonType.Operator}
                        onClick={()=>{addBracket()}}/>

                <!--       Sin, cos, tan, 1, 2, 3, -, %         -->
                {#if !inverse}
                    <Button text="sin" col={calcCol1Hor} row="3/4" type={ButtonType.Blank} character="s"/>
                    <Button text="cos" col={calcCol2Hor} row="3/4" type={ButtonType.Blank} character="c"/>
                    <Button text="tan" col={calcCol3Hor} row="3/4" type={ButtonType.Blank} character="t"/>

                    <Button text="ln" col={calcCol2Hor} row="4/5" type={ButtonType.Blank} character="l"/>
                    <Button text="log" col={calcCol3Hor} row="4/5" type={ButtonType.Blank} character="g"/>
                {:else}
                    <Button text="asin" col={calcCol1Hor} row="3/4" type={ButtonType.Blank} character="S"/>
                    <Button text="acos" col={calcCol2Hor} row="3/4" type={ButtonType.Blank} character="C"/>
                    <Button text="atan" col={calcCol3Hor} row="3/4" type={ButtonType.Blank} character="T"/>

                    <Button text="eˣ" col={calcCol2Hor} row="4/5" type={ButtonType.Blank} character="E"/>
                    <Button text="10ˣ" col={calcCol3Hor} row="4/5" type={ButtonType.Blank} character="G"/>
                {/if}
                <Button icon="ph:number-one" col={calcCol4Hor} row="3/4" character="1"/>
                <Button icon="ph:number-two" col={calcCol5Hor} row="3/4" character="2"/>
                <Button icon="ph:number-three" col={calcCol6Hor} row="3/4" character="3"/>
                <Button icon="ph:minus" col={calcCol7Hor} row="3/4" type={ButtonType.Operator} character="-"/>
                <Button icon="ph:percent" col={calcCol8Hor} row="3/4" type={ButtonType.Operator} character="%"/>

                <!--       e, ln, log, 0, ., backspace, +, =         -->
                <Button text="e" col={calcCol1Hor} row="4/5" type={ButtonType.Blank} character="e"/>
                <Button icon="ph:number-zero" col={calcCol4Hor} row="4/5" character="0"/>
                <Button icon="ph:dot-outline-fill" col={calcCol5Hor} row="4/5" character="."/>
                <Button icon="ph:backspace" col={calcCol6Hor} row="4/5" onClick={()=>{removeCharacter()}}/>
                <Button icon="ph:plus" col={calcCol7Hor} row="4/5" character="+" type={ButtonType.Operator}/>
                <Button icon="ph:equals" col={calcCol8Hor} row="4/5" type={ButtonType.Equals}
                        onClick={()=>{calculate()}}/>


            </div>
        {/if}
    </div>
</div>

<style>
    .calc-wrapper {
        width: 100%;
        height: 100%;
    }

    .buttons {
        display: grid;

        padding: 0;

        width: 100%;
        height: 100%;

        max-height: 100%;
        max-width: 100%;

        grid-row: 2 / 3;
        grid-column: 1 / 2;
    }

    .buttons-vertical {
        transition: 0.2s;

        grid-template-columns: repeat(20, 1fr);
        grid-template-rows: 1fr 0fr 0fr 1fr 1fr 1fr 1fr 1fr;
    }


    .buttons-horizontal {
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(4, 1fr);
    }

    .expanded {
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    }

    .calc {

        display: grid;

        padding: 0;

        width: 100%;
        height: 100%;

        grid-template-columns: 1fr;
        grid-template-rows: 33% 67%;
    }
</style>
