<script>
  import InfoBanner from "./InfoBanner.svelte";

  export const URL_FORM = "url-form";
  export let answer;

  let url = "";

  async function handleSubmit() {
    try {
      const resp = await fetch(`/api/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const body = await resp.json();
      answer = body;
    } catch (error) {
      console.log("could not get url");
    }
  }
</script>

<footer id="search-footer">
  <form class="flex-center" on:submit={handleSubmit} id={URL_FORM}>
    <input
      id="url"
      type="text"
      placeholder="https://pkg.go.dev/std"
      autocomplete="off"
      bind:value={url}
    />
    <button id="summarize" type="submit">Search</button>
    <InfoBanner />
  </form>
</footer>

<style>
  input {
    padding: 0px;
    padding-block: 0px;
    padding-inline: 0px;
    border: 0px;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #search-footer {
    position: fixed;
    left: 0px;
    bottom: 0px;
    display: flex;

    height: 80px;
    width: 100%;

    background-color: #1a1a1a;
    color: #fff;
  }

  #url-form {
    display: grid;
    grid-template-columns: 80% auto;
    width: 100%;
  }

  #url-form input {
    padding: 10px 15px;
    border: 1px solid var(--primary-color-dark);
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    font-size: 1em;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;

    background-color: #1e1e1e;
    color: var(--text-color);
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  #url-form input:focus {
    border-color: var(--primary-color);
    outline: none;
  }

  #url-form button {
    padding: 10px 20px;
    background-color: var(--primary-color);
    color: var(--text-color-dark);
    border: 1px solid var(--primary-color-dark);
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  #url-form button:hover {
    background-color: var(--primary-color-dark);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
</style>
