<script lang="ts">
  import { get } from "svelte/store";
  import { deleteUser, user, newName, ValidName } from "../store/user";
  import { useFocus, useNavigate } from "svelte-navigator";

  const navigate = useNavigate();
  const registerFocus = useFocus();

  let uuid = get(user).uuid;
  let name = get(user).name;

  function handleSubmit() {
    if (!ValidName(name)) return;
    newName(name);
    navigate("/");
  }

  $: validName = ValidName(name);
</script>

<div>
  {#if validName}
    <h3>The name if valid</h3>
  {:else}
    <h3>You need a name to use this app.</h3>
  {/if}

  <label for="name">Name</label>
  <input
    type="text"
    name="name"
    bind:value={name}
    use:registerFocus
    on:keyup={(e) => e.key === "Enter" && handleSubmit()}
  />

  <br />
  <label for="uuid">UUID</label>
  <input type="text" readonly bind:value={uuid} />

  <br />
  <button on:click={handleSubmit} class="greenButton">Submit</button>
  <button on:click={deleteUser} class="redButton">Delete User</button>
</div>

<style>
  .greenButton {
    background-color: rgb(142, 232, 142);
    color: white;
  }
  .redButton {
    background-color: rgb(237, 113, 113);
    color: white;
  }
</style>
