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

  // navigateToSettings();

  onMount(() => {
    RandomName();
  });

  let selfStream: MediaStream;
  let inboundStream: MediaStream;

  let { name, uuid } = get(user);
  let params = useParams();
  let roomId = $params.roomId;

  $: blueNode = new WebConnection({
    userName: name,
    userId: uuid,
    roomId: roomId,
  });

  async function handleJoin() {
    // where should the stream be created?
    // i.e. should the webrtc give me a stream back or should the component do it?
    selfStream = await blueNode.handleOutboundInit({
      audio: true,
      video: true,
    });
    blueNode.sendJoinRequest();
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
</script>

<div>The Room</div>
{#if blueNode}
  <MessageComp {sendMessage} {recieveMessage} />
{/if}

<button on:click={toggleVideo}>Toggle Video</button>
<button on:click={toggleAudio}>Toggle Audio</button>

<div class="video-grid">
  <button on:click={handleJoin}>Send Join</button>
  <button on:click={handleReceive}>Receive Join</button>

  {#if selfStream}
    <Video stream={selfStream} />
  {/if}

  {#if inboundStream}
    <Video stream={inboundStream} />
  {/if}
</div>

<style>
  .video-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 10px;
  }
</style>
