<script lang="ts">
  import { onMount } from "svelte";
  let wasPreviouslyMuted = true;
  const MUTE_KEY = "mute-info";

  function onClick(event: MouseEvent) {
    event.preventDefault();
    localStorage.setItem(MUTE_KEY, "true");
    wasPreviouslyMuted = true;
  }

  onMount(() => {
    wasPreviouslyMuted = localStorage.getItem(MUTE_KEY) === "true";
  });
</script>

{#if !wasPreviouslyMuted}
  <div id="banner">
    To get started, enter a URL and let DevQuick do the heavy lifting by
    providing summaries, key languages, and topics at a glance.
    <button on:click={onClick}>X</button>
  </div>
{/if}

<style>
  #banner {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 14.5%;
    transform: translateX(-50%);
    background: var(--primary-color-dark);
    color: var(--text-color-dark);
    padding: 8px 12px;
    max-width: 200px;
    border-radius: var(--border-radius);

    display: flex;
    flex-direction: row;
  }

  #banner button {
    font-size: large;
    cursor: pointer;
    background: none;
    border: none;
    height: fit-content;
    width: fit-content;
  }

  #banner::after {
    content: "";
    position: absolute;
    top: 100%; /* Position below the tooltip */
    left: 50%;
    transform: translateX(-50%);
    border-width: 10px;
    border-style: solid;
    border-color: var(--primary-color-dark) transparent transparent transparent;
  }
</style>
