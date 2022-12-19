<script lang="ts">
  import { onMount } from "svelte";

  export let stream: MediaStream;
  let audioStream = stream.getAudioTracks()[0];

  let audioContext: AudioContext;
  let analyser: AnalyserNode;
  let dataArray: Uint8Array;
  let canvas: HTMLCanvasElement;
  let canvasCtx: CanvasRenderingContext2D;
  let WIDTH: number = 400;
  let HEIGHT: number = 400;

  // write a function which analysis the audio stream and returns the fft
  function getAudioData() {
    analyser.getByteTimeDomainData(dataArray);
    //clear the canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.fillStyle = "rgba(0, 0, 0,0.3)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(255, 255, 255)";
    canvasCtx.beginPath();
    let sliceWidth = (WIDTH * 1.0) / analyser.fftSize;
    let x = 0;
    for (let i = 0; i < analyser.fftSize; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * HEIGHT) / 2;
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    canvasCtx.lineTo(WIDTH, HEIGHT / 2);
    canvasCtx.stroke();
  }

  onMount(() => {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    let source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    canvasCtx = canvas.getContext("2d");
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    setInterval(getAudioData, 100);
  });
</script>

<div>
  <canvas bind:this={canvas} />
</div>

<style>
  canvas {
    border: 1px solid black;
    height: 350px;
    width: 350px;
  }

  div {
    position: absolute;
  }
</style>
