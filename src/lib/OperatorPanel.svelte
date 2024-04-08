<script lang="ts">

    import Button from "./Button.svelte";
    import {ButtonType} from "../ButtonType";
    import Icon from "@iconify/svelte";
    import {Abbreviations} from "../Abbreviations";
    import {angleMode, toggleAngleMode} from "../Logic";

    export let row: string;
    export let col: string;

    let dropdownVisible = false;

    let angleModeValue: string;
    angleMode.subscribe(value => {
        angleModeValue = value.toUpperCase();
    })

    let inverse = false;

    function toggleVisible() {
        dropdownVisible = !dropdownVisible;
    }
</script>


<div class="panel" style={`grid-column: ${col}; grid-row: ${row}`} class:expanded={dropdownVisible}>
    <Button icon="tabler:square-root" row="1/2" col="1/2" type={ButtonType.Blank} character="√"/>
    <Button icon="ph:pi" row="1/2" col="2/3" type={ButtonType.Blank} character="π"/>
    <Button icon="ri:arrow-drop-up-line" row="1/2" col="3/4" type={ButtonType.Blank} character="^"/>
    <Button icon="ph:exclamation-mark" row="1/2" col="4/5" type={ButtonType.Blank} character="!"/>

    <Button icon={dropdownVisible ? "ph:arrow-bend-right-up" : "ph:arrow-bend-right-down"} row="1/2" col="5/6"
            type={ButtonType.Blank} onClick={()=>{dropdownVisible=!dropdownVisible}}/>

    {#if dropdownVisible}
        <Button text={angleModeValue} row="2/3" col="1/2" type={ButtonType.Blank} onClick={()=>{toggleAngleMode()}}/>
        <Button text="INV" row="3/4" col="1/2" type={ButtonType.Blank} onClick={()=>{inverse=!inverse}}/>
        <Button text="e" row="3/4" col="2/3" type={ButtonType.Blank} character="e"/>

        <Button text="ln" row="3/4" col="3/4" type={ButtonType.Blank} character="l"/>
        <Button text="log" row="3/4" col="4/5" type={ButtonType.Blank} character="g"/>

        {#if !inverse}
            <Button text="sin" row="2/3" col="2/3" type={ButtonType.Blank} character="s"/>
            <Button text="cos" row="2/3" col="3/4" type={ButtonType.Blank} character="c"/>
            <Button text="tan" row="2/3" col="4/5" type={ButtonType.Blank} character="t"/>
        {:else}
            <Button text="asin" row="2/3" col="2/3" type={ButtonType.Blank} character="S"/>
            <Button text="acos" row="2/3" col="3/4" type={ButtonType.Blank} character="C"/>
            <Button text="atan" row="2/3" col="4/5" type={ButtonType.Blank} character="T"/>
        {/if}


    {/if}


</div>


<style>
    .panel {


        display: grid;

        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr;
    }

    .expanded {
        grid-template-rows: repeat(3, 1fr);
    }

    .arrow {
        display: flex;
        justify-content: center;
        align-items: center;

        transition: transform 0.3s;
    }

    .arrow-up {
        transform: rotate(180deg);
    }

    .arrow-down {
        transform: rotate(0deg);
    }
</style>