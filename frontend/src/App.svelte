<script lang="ts">
  import blueNodeLogo from "./assets/knot.png";
  import { NewWebConnection } from "./utils/webrtc";
  $: text = "Hello World";

  async function FetchSDP() {
    let connection = await NewWebConnection({});
    let localDesc = JSON.stringify(connection.localDescription);
    text = localDesc;
    let ans = await fetch("http://localhost:8080/join/fancyPants");
    let json = await ans.json();
    text = JSON.stringify(json);
  }
</script>

<main>
  <h1>
    <img src={blueNodeLogo} alt="Bluenode logo" class="logoImage" />
    <a href="/" class="inside_text">Blue Node</a>
  </h1>

  <p class="read-the-docs">Fancy</p>

  <button on:click={FetchSDP}>Fetch SDP</button>
  <textarea bind:value={text} />
</main>

<style>
  h1 {
    flex-direction: row;
    display: flex;
    align-items: center;
  }
</style>
