<script lang="ts">
  import { onMount } from "svelte";

  export let stream: MediaStream;

  function srcObject(node, stream) {
    console.log("srcObject", node, stream);
    node.srcObject = stream;

    return {
      update(newStream) {
        if (node.srcObject != newStream) {
          node.srcObject = newStream;
        }
      },
      destroy() {
        console.log("video element is destroyed");
        /* stream revoking logic here */
      },
    };
  }
</script>

<div>
  <video use:srcObject={stream} autoplay controls>
    <track kind="captions" />
  </video>
</div>

<style>
  video {
    border: 1px solid black;
    height: 404px;
    width: 404px;
  }
</style>
