<script land="ts">
  import { Link } from "svelte-navigator";
</script>

<main>
  <h1>FOUR ZERO FOUR</h1>
  <p>Page not found</p>
  <div class="wrapper">
    <Link to="/">
      <a href="/">Go back home</a>
    </Link>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .wrapper {
    margin-top: 1rem;
  }

  a {
    text-decoration: underline;
    color: #3e488c;
  }
</style>
