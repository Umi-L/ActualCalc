<script lang="ts">
    import Menu from '@smui/menu';
    import List, {
        Item,
        Separator,
        Text,
        PrimaryText,
        SecondaryText,
    } from '@smui/list';

    import {addStringAtCursor, type Calculation, getDisplayString} from "../Logic";
    import {onMount} from "svelte";
    import Button from "./Button.svelte";
    import {ButtonType} from "../ButtonType";
    import {historyMenuOpen} from "../main";
    import {history} from "../Settings";

    let historyValue: Calculation[] = [];

    let itemsDiv: HTMLDivElement;

    let menu: Menu;

    onMount(() => {
        itemsDiv.scrollTop = itemsDiv.scrollHeight;

        itemsDiv.onresize = () => {
            itemsDiv.scrollTop = itemsDiv.scrollHeight;
        }
    });

    history.subscribe((value) => {
        historyValue = value;

        // sort the history by the time it was added
        historyValue.sort((a, b) => {
            // whichever date is greater is the one that was added first
            return a.date < b.date ? -1 : 1;
        });
    });

    function getDaysAgo(date: string | Date): string {
        const today = new Date();

        if (typeof date === "string") {
            date = new Date(date);
        }

        const diff = getEpochDays(today) - getEpochDays(date);

        if (diff === 0) {
            return "Today";
        } else if (diff === 1) {
            return "Yesterday";
        } else {
            return `${diff} days ago`;
        }
    }

    function getEpochDays(date: Date): number {
        return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    }
</script>


<div class="history">

    <div class="header">
        <div class="header-side-start">
            <div class="grid-cell">

                <Button icon="ph:arrow-left" col="1/2" row="1/2" type={ButtonType.Blank}
                        onClick={()=>{historyMenuOpen.set(true); historyMenuOpen.set(false);}}/>
            </div>

            <p>History</p>
        </div>

        <div class="header-side-end">
            <div class="grid-cell">
                <Button icon="ph:dots-three-vertical" col="1/2" row="1/2" type={ButtonType.Blank}
                        onClick={()=>{menu.setOpen(true);}}/>

                <Menu
                        bind:this={menu}
                >
                    <List>
                        <Item on:SMUI:action={()=>{history.set([])}}>
                            <Text>
                                <PrimaryText>Clear History</PrimaryText>
                            </Text>
                        </Item>
                        <Item on:SMUI:action={()=>{}}>
                            <Text>
                                <PrimaryText>Settings</PrimaryText>
                            </Text>
                        </Item>
                    </List>
                </Menu>
            </div>
        </div>
    </div>

    <div class="items" bind:this={itemsDiv}>
        {#each historyValue as calculation, index}
            {#if index > 0}
                {#if getDaysAgo(calculation.date) !== getDaysAgo(historyValue[index - 1].date)}
                    <div class="time-separator">
                        <p>{getDaysAgo(calculation.date)}</p>
                    </div>
                {/if}
            {:else}
                <div class="time-separator">
                    <p>{getDaysAgo(calculation.date)}</p>
                </div>
            {/if}
            <div class="item">
                <button class="calculation"
                        on:click={()=>{addStringAtCursor(calculation.calculation)}}>{getDisplayString(calculation.calculation)}</button>
                <button class="result"
                        on:click={()=>{addStringAtCursor(calculation.result)}}>{calculation.result}</button>
            </div>
        {/each}
    </div>

</div>


<style>

    .header {
        width: 100%;

        font-size: 1.5rem;
        font-weight: 300;

        padding: 0.5rem;

        background-color: var(--foreground-color);

        display: flex;
        justify-content: space-between;
    }

    p {
        color: var(--text-color);
    }

    .items {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;

        display: flex;
        flex-direction: column;
    }

    .item {
        width: 100%;
        padding: 1rem;

        text-align: end;

        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .grid-cell {
        display: grid;

        height: 50%;
        aspect-ratio: 1/1;
    }

    .header-side-end {
        display: flex;
        justify-content: end;
        align-items: center;

        height: 100%;
        width: 100%;
    }

    .header-side-start {
        display: flex;
        justify-content: start;
        align-items: center;

        height: 100%;
        width: 100%;
    }

    .calculation {
        font-size: 1.5em;
        color: var(--text-color);
    }

    button {
        margin: 0;

        border: none;
        background-color: transparent;

        display: flex;
        justify-content: end;
        align-items: center;
    }

    .result {
        font-size: 1.5em;
        color: var(--button-text-color);
    }

    .history {
        width: 100%;
        height: 100%;
        background-color: var(--history-color);

        display: flex;
        flex-direction: column;
    }

    .time-separator {
        width: 100%;
        padding: 1rem;

        font-size: 1.2em;

        color: var(--seperator-color);

        border-top: 2px solid var(--foreground-color);

        display: flex;
        justify-content: left;
    }

</style>