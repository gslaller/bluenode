<script lang="ts">
  import { get } from "svelte/store";
  import { onMount } from "svelte";
  import { RandomName, user } from "../store/user";
  import navigateToSettings from "../utils/navigateToSettings";
  import Input from "../components/Input.svelte";
  import { prevent_default } from "svelte/internal";
  import AccountImage from "../assets/account-100.png";
  import IconImage from "../assets/knot.png";
  import { Link } from "svelte-navigator";

  onMount(() => {
    // RandomName();
  });
</script>

<home>
  <header>
    <intro>
      <introname>
        <img src={IconImage} alt="bluenode" class="introimage" />
        <h1>BLUENODE</h1>
      </introname>
      <introslogan>
        <h3>A simple browser based conferencing application</h3>
        <h4 class="margintop">Made with: pion/webrtc, svelte and ...</h4>
        <h4>
          Follow me: <a
            class="githublink"
            href="https://github.com/gslaller"
            target="_blank"
            rel="noopener noreferrer">github.com/gslaller</a
          >
        </h4>
      </introslogan>
    </intro>
    <rightcol>
      <idcard>
        <cardimg>
          <img src={AccountImage} alt="Account" class="avatarimage" />
        </cardimg>
        <cardname> Gurpreet Singh Laller </cardname>
        <cardhandler> @&nbsp;gslaller </cardhandler>
        <cardset>
          <Link to="/settings">
            <a href="/">
              <h1>⚙</h1>
            </a>
          </Link>
        </cardset>
      </idcard>
      <Link to="/createroom">
        <a href="/createroom" class="createroombutton"> Create new Room </a>
      </Link>
    </rightcol>
  </header>
  <content>
    <idx>
      <span>Nr. </span>
    </idx>
    <roomname>
      <span>Room Name </span>
      <button class="sorttoggle">⬇</button>
    </roomname>
    <creator>
      <span>Creator </span>
      <button class="sorttoggle">⬇</button>
    </creator>
    <iat>
      <span>Time </span>
      <button class="sorttoggle">⬇</button>
    </iat>
    <live>
      <span>Live </span>
      <button class="sorttoggle">⬇</button>
    </live>
    <funcs> Funcs </funcs>
  </content>
</home>

<style>
  home {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  header {
    max-width: 100%;
    height: 12rem;
    padding: 4px;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    border-bottom: 3px solid #3e488c;
  }

  intro {
    margin-left: 4rem;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
  }

  introname {
    display: flex;
    flex-direction: row;
  }

  .introimage {
    align-self: center;
  }

  introslogan {
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
  }

  rightcol {
    margin-right: 4rem;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .createroombutton {
    width: fit-content;
    padding-left: 2rem;
    padding-right: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    border: 2px solid #3e488c;
    background-color: transparent;
    font-size: large;
    font-weight: 900;
    text-decoration: none;
    vertical-align: middle;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .createroombutton:hover {
    background-color: #3e488c;
    color: white;
  }

  idcard {
    align-self: center;

    border-radius: 0.5rem;
    border: 2px solid #3e488c;

    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    grid-template-rows: 2rem 2rem;
    gap: 0.2em 0.5em;
  }

  cardimg {
    grid-column: 1;
    grid-row: 1 / 3;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 2px solid #3e488c78;
    /* fit image into container*/
  }

  cardname {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  cardhandler {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  cardset {
    grid-column: 3;
    grid-row: 1 / 3;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    border-left: 2px solid #3e488c78;
  }

  .avatarimage {
    max-width: 100%;
    max-height: 100%;
    /* object-fit: cover; */
  }

  .margintop {
    margin-top: 0.5rem;
  }

  .githublink {
    text-decoration: underline;
  }

  .githublink:hover {
    color: #292e51;
  }

  /**
    THE CONTENT
  */

  content {
    display: grid;
    grid-template-columns:
      max-content 1fr minmax(min-content, 16rem) minmax(min-content, 6rem)
      minmax(min-content, 8rem) 8rem;
    column-gap: 0.2rem;
    grid-template-rows: auto;
    grid-auto-rows: 2rem 2rem;
    gap: 0.2em 0.5em;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-top: 0.5rem;
    justify-content: stretch;
  }

  idx,
  roomname,
  creator,
  iat,
  live,
  funcs {
    /* border-right: 2px solid gainsboro; */
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 0.25rem;
    border-bottom: #3e488c78 2px solid;
    /* background-color: aquamarine; */
  }

  idx {
    padding-right: 0.5rem;
  }

  .sorttoggle {
    max-height: 100%;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
    font-weight: 900;
    background-color: #3e488c22;
    border-radius: 0.5rem;
    border: 0px solid transparent;
    text-align: center;
  }

  .sorttoggle:hover {
    background-color: #3e488c44;
  }

  /**fancy rotation TODO: when implementing the sort*/
  /* .sorttoggle:hover {
    animation: rotate 0.5s ease-in-out 1 normal forwards;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(180deg);
    }
  } */
</style>
