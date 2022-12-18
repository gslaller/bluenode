<script lang="ts">
  import { get } from "svelte/store";
  import { RandomName, user } from "../store/user";
  import { onMount } from "svelte";
  import navigateToSettings from "../utils/navigateToSettings";
  import Video from "../components/Video.svelte";
  import { getUserMedia, StopStream } from "../utils/userMedia";
  import { WebConnection } from "../webrtc/main";
  import { useParams } from "svelte-navigator";

  // navigateToSettings();

  onMount(() => {
    RandomName();
  });

  let selfStream: MediaStream;
  let { name, uuid } = get(user);
  let params = useParams();
  let roomId = $params.roomId;
  console.log("params", roomId);

  $: blueNode = new WebConnection({
    stream: selfStream,
    userName: name,
    userId: uuid,
    roomId: "one",
  });

  onMount(async () => {
    selfStream = await getUserMedia();

    return () => StopStream(selfStream);
  });
</script>

<div>The Room</div>
<div class="video-grid">
  <!-- <Video stream={selfStream} /> -->
  <!-- <Video stream={selfStream} /> -->
  <!-- <Video stream={selfStream} /> -->
  <!-- <Video stream={selfStream} /> -->
  <!-- <Video stream={selfStream} /> -->
  <!-- <Video stream={selfStream} /> -->
</div>

<style>
  .video-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 10px;
  }
</style>
