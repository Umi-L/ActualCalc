<script lang="ts">
    import Button from "./lib/Button.svelte";
    import {onMount} from "svelte";
    import {Orientation} from "./Orientation";
    import {ButtonType} from "./ButtonType";
    import Results from "./lib/Results.svelte";
    import {addBracket, calculate, clear, removeCharacter} from "./Logic";

    import ACIcon from "./lib/ACIcon.svelte";
    import OperatorPanel from "./lib/OperatorPanel.svelte";

    let orientation: Orientation;

    let calcDiv: HTMLDivElement;

    onMount(() => {
        windowResize();

        // register event listener
        window.addEventListener("resize", windowResize);
        window.addEventListener("orientationchange", windowResize);
    });

    function windowResize() {
        // calculate orientation
        orientation = window.innerWidth > window.innerHeight ? Orientation.Landscape : Orientation.Portrait;
    }
</script>


<div class="calc-wrapper">
    <div class="calc" bind:this={calcDiv}>

        <Results col="1/5" row="1 / -7"/>

        <div class="buttons">
            <Button icon="ph:number-zero" col="1/2" row="-1/-2" character="0"/>
            <Button icon="ph:dot-outline-fill" col="2/3" row="-1/-2" character="."/>
            <Button icon="ph:backspace" col="3/4" row="-1/-2" onClick={()=>{removeCharacter()}}/>
            <Button icon="ph:equals" col="4/5" row="-1/-2" type={ButtonType.Equals} onClick={()=>{calculate()}}/>

            <!--    1, 2, 3, +    -->
            <Button icon="ph:number-one" col="1/2" row="-2/-3" character="1"/>
            <Button icon="ph:number-two" col="2/3" row="-2/-3" character="2"/>
            <Button icon="ph:number-three" col="3/4" row="-2/-3" character="3"/>
            <Button icon="ph:plus" col="4/5" row="-2/-3" character="+" type={ButtonType.Operator}/>

            <!--    4, 5, 6, -    -->
            <Button icon="ph:number-four" col="1/2" row="-3/-4" character="4"/>
            <Button icon="ph:number-five" col="2/3" row="-3/-4" character="5"/>
            <Button icon="ph:number-six" col="3/4" row="-3/-4" character="6"/>
            <Button icon="ph:minus" col="4/5" row="-3/-4" type={ButtonType.Operator} character="-"/>

            <!--    7, 8, 9, *    -->
            <Button icon="ph:number-seven" col="1/2" row="-4/-5" character="7"/>
            <Button icon="ph:number-eight" col="2/3" row="-4/-5" character="8"/>
            <Button icon="ph:number-nine" col="3/4" row="-4/-5" character="9"/>
            <Button icon="ph:x" col="4/5" row="-4/-5" type={ButtonType.Operator} character="*"/>

            <!--    Clear, (), %, divide    -->
            <Button text="AC" col="1/2" row="-5/-6" type={ButtonType.Clear} onClick={()=>{clear()}}/>
            <Button icon="ph:brackets-round" col="2/3" row="-5/-6" type={ButtonType.Operator}
                    onClick={()=>{addBracket()}}/>
            <Button icon="ph:percent" col="3/4" row="-5/-6" type={ButtonType.Operator}/>
            <Button icon="ph:divide" col="4/5" row="-5/-6" type={ButtonType.Operator} character="/"/>

            <OperatorPanel col="1/5" row="-6/-7"/>
        </div>

    </div>
</div>

<style>
    .calc-wrapper {
        width: 100%;
        height: 100%;
    }

    .buttons{

        grid-row: -1/-7;
        grid-column: 1 / 5;

        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(6, 1fr);
        padding: 0;

        width: 100%;
        height: 100%;

        max-height: 100%;
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
