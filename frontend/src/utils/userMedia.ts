
export async function getUserMedia(obj: MediaStreamConstraints): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia(obj);
}

export async function StopStream(stream: MediaStream) {
    stream.getTracks().forEach(track => track.stop());
}

