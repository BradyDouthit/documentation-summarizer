<script>
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
      answer = body.answer;
    } catch (error) {
      console.log("could not get url");
    }
  }
</script>

<form class="flex-center" on:submit={handleSubmit} id={URL_FORM}>
  <input
    id="url"
    type="text"
    placeholder="https://pkg.go.dev/std"
    bind:value={url}
  />
  <button id="summarize" type="submit">Search</button>
</form>

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

  #url-form {
    position: fixed;
    left: 0px;
    bottom: 0px;
    height: 80px;
    width: 100%;
    display: flex;
    flex-direction: row;
    background: red;
  }

  #url-form input,
  button {
    height: 30px;
  }
</style>
