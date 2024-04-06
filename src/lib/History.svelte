<script lang="ts">


    import {addStringAtCursor, type Calculation, getDisplayString, history} from "../Logic";

    let historyValue: Calculation[] = [];

    history.subscribe((value) => {
        historyValue = value;
    });
</script>



<div class="history">

    <div class="header">
        <p>History</p>
    </div>

    <div class="items">
        {#each historyValue as calculation}
            <div class="item">
                <p class="calculation" on:click={()=>{addStringAtCursor(calculation.calculation)}}>{getDisplayString(calculation.calculation)}</p>
                <p class="result" on:click={()=>{addStringAtCursor(calculation.result)}}>{calculation.result}</p>
            </div>
        {/each}
    </div>

</div>



<style>

    .header{
        width: 100%;

        font-size: 1.5rem;
        font-weight: 300;

        padding: 0.5rem;

        background-color: var(--foreground-color);
    }

    .items{
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .item{
        width: 100%;
        padding: 1rem;

        text-align: end;

        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .calculation{
        font-size: 1.5em;
        color: var(--text-color);
    }

    p{
        margin: 0;
    }

    .result{
        font-size: 1.5em;
        color: var(--button-text-color);
    }

    .history{
        width: 100%;
        height: 100%;
        background-color: var(--history-color);

        display: flex;
        flex-direction: column;
    }
</style>