<script lang="ts">
  export let sendMessage: (message: string) => void;
  export let recieveMessage: (f: (message: string) => void) => void;

  $: messages = new Array<string>();
  let message = "";

  function handleSendMessage() {
    if (message.length > 0) {
      sendMessage(message);
      message = "";
    }
  }

  recieveMessage((message) => {
    console.log("recieved message", message);
    messages = [message, ...messages];
  });

  function scrollDown(node) {
    node.scrollTop = node.scrollHeight;
  }

  function handleKeyUp(e) {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }
</script>

<span>
  <input
    type="text"
    bind:value={message}
    placeholder="Message"
    on:keyup={handleKeyUp}
  />
  <button on:click={handleSendMessage}>Send</button>
</span>

<ul use:scrollDown>
  {#each messages as message}
    <li>{message}</li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    padding: 0;
    max-height: 200px;
    overflow-x: scroll;
  }
</style>
