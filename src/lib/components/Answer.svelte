<script>
  export let answer;
  $: {
    console.log(answer);
  }
</script>

<section id="full-answer-wrapper">
  {#if Object.entries(answer).length > 0 && Array.isArray(answer.languages) && Array.isArray(answer.keywords)}
    <h2 class="topic">{answer.topic}</h2>

    <div class="languages-wrapper">
      {#each answer.languages as language}
        <span class="language">{language}</span>
      {/each}
    </div>

    <div class="keywords-wrapper">
      {#each answer.keywords as keyword}
        <span class="keyword">{keyword}</span>
      {/each}
    </div>

    <p class="summary">{answer.summary}</p>
  {/if}
</section>

<style>
  #full-answer-wrapper {
    width: 80%;
    padding: 12px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .language {
    margin-right: 8px;
    padding: 5px 10px;
    border-radius: 4px;

    background-color: var(--primary-color);
    color: var(--text-color-dark);
  }

  .topic {
    margin-top: 20px;

    font-size: 1.5em;
    font-weight: bold;
    color: var(--primary-color-dark);
  }

  .keyword {
    display: inline-block;
    margin-right: 8px;
    padding: 5px 10px;
    border-radius: 4px;

    background-color: var(--accent-color);
    color: var(--text-color-dark);
  }

  .summary {
    margin-top: 20px;
    line-height: 1.6;
    padding: 15px;
    border-radius: 8px;

    background-color: #1a1a1a;
    border-left: 5px solid var(--primary-color);
  }
</style>
