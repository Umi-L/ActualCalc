<script lang="ts">


    import {type Calculation, history} from "../Logic";

    let historyValue: Calculation[] = [];

    history.subscribe((value) => {
        historyValue = value;
    });
</script>



<div class="history">
    {#each historyValue as calculation}
        <div>
            <p>{calculation.calculation}</p>
            <p>{calculation.result}</p>
        </div>
    {/each}
</div>



<style>
    .history{
        width: 100%;
        height: 100%;
        background-color: var(--history-color);
    }
</style>