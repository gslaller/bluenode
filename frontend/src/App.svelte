<script lang="ts">
  import blueNodeLogo from "./assets/knot.png";
  import { Router, Link, Route } from "svelte-navigator";

  import Home from "./pages/Home.svelte";
  import Settings from "./pages/Settings.svelte";
  import Room from "./pages/Room.svelte";

  import { user } from "./store/user";
</script>

<Router>
  <nav class="nav">
    <img src={blueNodeLogo} alt="Bluenode logo" class="logoImage" />
    <Link to="/">Home</Link>
    <Link to="settings">Settings</Link>
    <span
      >Username:
      <span class="textToUnderscore">{$user.name}</span>
    </span>
  </nav>
  <div>
    <Route path="/">
      <Home />
    </Route>
    <Route path="/settings">
      <Settings />
    </Route>
    <Route path="/room/:roomId">
      <Room />
    </Route>
  </div>
</Router>

<style>
  .nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
    padding: 0.5rem;
  }

  .textToUnderscore {
    text-decoration: underline;
  }

  .logoImage {
    height: 2rem;
  }
</style>
