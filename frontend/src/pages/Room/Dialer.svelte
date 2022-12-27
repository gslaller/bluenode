<script lang="ts">
  export let value: number = 3;
  export let min: number = 2;
  export let max: number = 9;
  export let text: string = "";

  function decrease() {
    if (value > min) {
      value -= 1;
    }
  }

  function increase() {
    if (value < max) {
      value += 1;
    }
  }
</script>

<dialer>
  <button class="decrease" on:click={decrease}> - </button>
  <dialertext> {text} [&nbsp;{value}&nbsp;] </dialertext>
  <button class="increase" on:click={increase}> + </button>
</dialer>

<style>
  dialer {
    display: flex;
    border: 1px solid black;
    border-radius: 4px;
  }

  button:hover {
    cursor: pointer;
    background: #3e488c;
    color: white;
  }

  .decrease,
  .increase {
    border: none;
    place-self: center center;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    font-size: larger;
  }

  .decrease {
    border-right: 1px solid black;
  }

  .increase {
    border-left: 1px solid black;
  }

  dialertext {
    place-self: center center;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    font-size: small;
    font-weight: 600;
  }
</style>
