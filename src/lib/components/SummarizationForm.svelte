<script>
  import InfoBanner from "./InfoBanner.svelte";

  export const URL_FORM = "url-form";
  export let answer;

  let url = "";
  let question = "";

  async function handleSubmit() {
    try {
      const resp = await fetch(`/api/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, question }),
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
    <textarea
      class="fw"
      id="question"
      placeholder="Help me make a web server in Go"
      bind:value={question}
    />
    <input
      id="url"
      type="text"
      placeholder="(optional) https://pkg.go.dev/std"
      autocomplete="off"
      class="fw"
      bind:value={url}
    />
    <button id="summarize" type="submit">Search</button>
    <InfoBanner />
  </form>
</footer>

<style>
  input,
  textarea {
    padding: 0px;
    padding-block: 0px;
    padding-inline: 0px;
    border: 0px;

    font-size: 1em;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;

    background-color: #1e1e1e;
    color: var(--text-color);
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border: 1px solid var(--primary-color-dark);
    border-radius: var(--border-radius);
    outline: none;
    padding: 10px 15px;
  }

  button {
    padding: 10px 20px;
    background-color: var(--primary-color);
    color: var(--text-color-dark);
    border: none;
    border-radius: var(--border-radius);
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .fw {
    width: 100%;
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
    align-items: center;
    justify-content: center;

    width: 100%;
    padding: 12px 0px;
    background-color: #1a1a1a;
    color: #fff;
  }

  #url-form {
    display: flex;
    flex-direction: column;
    gap: 8px;

    width: 80%;
  }

  #url-form input:focus {
    border-color: var(--primary-color);
    outline: none;
  }

  #url-form button {
    align-self: flex-start;
  }

  #url-form button:hover {
    background-color: var(--primary-color-dark);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
</style>
