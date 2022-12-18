

interface WebConnectionProps {
    video?: boolean;
    audio?: boolean;
    data?: boolean;
}

export async function NewWebConnection({ }: WebConnectionProps): Promise<RTCPeerConnection> {
    return new Promise(async (resolve, reject) => {
        const pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302'
                }
            ]
        })

        pc.onconnectionstatechange = (e) => {
            console.log("pc.onconnectionstatechange", e);
        }

        pc.onicecandidate = (e) => {
            if (e.candidate === null) {
                resolve(pc)
            }
            // resolve(pc);
        }
        pc.addTransceiver('video', { streams: [], direction: 'sendonly' })
        pc.addTransceiver('audio', { streams: [], direction: 'sendonly' })
        let offer = await pc.createOffer();
        pc.setLocalDescription(offer);

    });
}

export const funny = 1;