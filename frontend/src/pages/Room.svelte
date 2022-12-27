<script lang="ts">
  import { get } from "svelte/store";
  import { RandomName, user } from "../store/user";
  import { onMount, onDestroy } from "svelte";
  import navigateToSettings from "../utils/navigateToSettings";
  import Video from "../components/Video.svelte";
  import { getUserMedia, StopStream } from "../utils/userMedia";
  import { WebConnection } from "../webrtc/main";
  import { useParams } from "svelte-navigator";
  import AudioVisualizer from "../components/AudioVisualizer.svelte";
  import MessageComp from "../components/MessageComp.svelte";
  import Dialer from "./Room/Dialer.svelte";
  import { Link } from "svelte-navigator";

  // navigateToSettings();

  onMount(() => {
    RandomName();
  });

  let selfStream: MediaStream;
  let inboundStream: MediaStream;

  let { name, uuid } = get(user);
  let params = useParams();
  let roomId = $params.roomId;

  let screenSharingOn = false;

  $: blueNode = new WebConnection({
    userName: name,
    userId: uuid,
    roomId: roomId,
  });

  let newTrack = 0;

  $: blueNode.registerNewTrackCallback(() => {
    newTrack += 1;
    console.log("new track");
  });

  async function handleJoin() {
    // where should the stream be created?
    // i.e. should the webrtc give me a stream back or should the component do it?
    selfStream = await blueNode.handleOutboundInit({
      audio: true,
      video: true,
    });
    await blueNode.sendJoinRequest();
    blueNode.addMedia();
  }

  async function handleReceive() {
    inboundStream = await blueNode.handleInboundInit();
  }

  onDestroy(() => {
    blueNode.CleanUp();
    blueNode = null;
  });

  function sendMessage(message: string) {
    blueNode.sendMessage(message);
  }

  function recieveMessage(f: (data: string) => void) {
    blueNode.recieveMessage(f);
  }

  function toggleVideo() {
    blueNode.toggleVideo();
  }

  function toggleAudio() {
    blueNode.toggleAudio();
  }

  function changeToScreenShare() {
    screenSharingOn = true;
    blueNode.chageToScreenShare();
  }

  function changeToCamera() {
    screenSharingOn = false;
    blueNode.changeToCamera();
  }
</script>

<main>
  <topbar>
    <a href="/#">
      <Link to="/">Home</Link>
    </a>
    <span>Name:</span>
    <span>Admin:</span>
    <button>&#60;&#60; Message &#60;&#60;</button>
  </topbar>
  <maincontent> Main Content</maincontent>
  <bottombar>
    <button>Back (0 / 15)</button>
    <button>Mic</button>
    <button>Video</button>
    <button>Raise Hand</button>
    <Dialer text="col" />
    <Dialer text="row" />
    <button>Next (4 / 15)</button>
  </bottombar>
  <sidebar />
</main>

<style>
  main {
    display: grid;
    grid-template-columns: 1fr 20rem;
    grid-template-rows: 2rem 1fr 2rem;
    height: 100vh;
    align-items: center;
    justify-content: center;
  }

  topbar {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    align-self: stretch;
    display: flex;
    align-items: center;
    border-bottom: 1px solid black;
  }

  maincontent {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    align-self: stretch;
  }

  bottombar {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
    align-self: stretch;
    border-top: 1px solid black;
    display: flex;
    gap: 1rem;
  }

  sidebar {
    grid-column: 2 / 3;
    grid-row: 1 / 4;
    align-self: stretch;
    border-left: 1px solid black;
  }
</style>
