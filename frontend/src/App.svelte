<script lang="ts">
  import { Router, Route } from "svelte-navigator";

  import Home from "./pages/Home.svelte";
  import Settings from "./pages/Settings.svelte";
  import Room from "./pages/Room.svelte";

  import Error from "./pages/Error.svelte";
  import CreateRoom from "./pages/CreateRoom.svelte";
</script>

<Router>
  <!-- <nav class="nav">
    <img src={blueNodeLogo} alt="Bluenode logo" class="logoImage" />
    <Link to="/">Home</Link>
    <Link to="settings">Settings</Link>
    <span
      >Username:
      <span class="textToUnderscore">{$user.name}</span>
    </span>
  </nav> -->
  <Route path="/" exact>
    <Home />
  </Route>
  <Route path="/settings">
    <Settings />
  </Route>
  <Route path="/room/:userHandler/:roomId">
    <Room />
  </Route>

  <Route path="/createroom">
    <CreateRoom />
  </Route>
  <Route>
    <Error />
  </Route>
</Router>
