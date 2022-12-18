
export async function getUserMedia(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    });
}

export async function StopStream(stream: MediaStream) {
    stream.getTracks().forEach(track => track.stop());
}

