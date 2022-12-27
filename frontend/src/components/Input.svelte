<script lang="ts">
  let value = "";
  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter") {
      alert(value);
    }
  }
</script>

<input type="text" on:keypress={handleKeyUp} bind:value />

<style>
  input {
    border: none;
    border-bottom: 1px solid black;
  }
</style>
