<script lang="ts">
  import { Link, useNavigate } from "svelte-navigator";
  import CloneImage from "../assets/clone.png";

  const navigate = useNavigate();
</script>

<main>
  <header>
    <headertext>
      <h2 class="backsign">
        <a href="#top" class="backlink" on:click={() => navigate(-1)}>
          Go Back:
        </a>
      </h2>

      <h1 class="bluelogo">Bluenode</h1>
      <h2 class="underh1">Create a new Room</h2>
    </headertext>
  </header>
  <content>
    <leftcontent>
      <label for="name">
        <h2>Room Name:</h2>
      </label>
      <input type="text" name="name" class="nameinput" autocomplete="off" />
      <label for="description" class="description">
        <h2>Description:</h2>
      </label>
      <textarea name="description" rows="4" cols="40" class="textarea" />
      <button class="submitbutton">Create Room</button>
    </leftcontent>
    <rightcontent>
      <h2>Current Spec:</h2>
      <bucket>
        <div class="bucketheadline">
          <h3>URL:</h3>
          <button class="copybutton">Copy URL</button>
        </div>
        <div class="bucketcontent">https://bluenode.com/room/laller/123</div>
      </bucket>
      <bucket>
        <div class="bucketheadline">
          <h3>Admin:</h3>
        </div>
        <span>@laller</span>
      </bucket>
    </rightcontent>
  </content>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  header {
    max-width: 100%;
    height: 10rem;
    padding: 4px;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    border-bottom: 3px solid #3e488c;
  }

  headertext {
    display: grid;
    grid-template-columns: max-content max-content;
    grid-template-rows: 1fr 1fr;
    margin-left: 4rem;
    margin-top: 2rem;
  }

  .backsign {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    align-self: baseline;
    font-weight: bold;
    justify-self: end;
    text-decoration: underline;
  }

  .backlink {
    margin-right: 1rem;
  }

  .bluelogo {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    align-self: baseline;
    justify-self: start;
  }

  .underh1 {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    align-self: flex-start;
    justify-self: start;
  }

  /*
    CONTENT
  */

  content {
    display: grid;
    grid-template-columns: 1fr 1fr;

    justify-content: center;
    margin-top: 2rem;
  }

  leftcontent {
    justify-self: flex-end;
    width: max-content;
    display: flex;
    flex-direction: column;
    align-items: flex-center;
    justify-content: center;
    margin-right: 2rem;
    gap: 0.5rem;
  }

  .description {
    margin-top: 1rem;
  }

  .textarea {
    resize: none;
    font-size: large;
    padding: 0.5rem;
  }

  .nameinput {
    padding: 0.5rem;
    align-self: stretch;
    font-size: large;
  }

  .submitbutton {
    margin-top: 1rem;
    align-self: stretch;
    font-size: large;
    background-color: white;
    outline: 1px solid #3e488c;
    color: #3e488c;
    border: none;
    border-radius: 5px;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .submitbutton:hover {
    cursor: pointer;
    background-color: #3e488c;
    color: white;
  }

  rightcontent {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    gap: 0.5rem;
  }

  bucket {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .bucketheadline {
    display: flex;
    flex-direction: row;
  }

  .copybutton {
    margin-left: 1rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    font-size: large;
    border-radius: 5px;
  }

  .copybutton:hover {
    cursor: pointer;
    background-color: #3e488c;
    color: white;
  }

  .bucketcontent {
    font-size: large;
    max-width: 25rem;
    text-overflow: ellipsis;
  }
</style>
