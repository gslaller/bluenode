interface WebConnectionProps {
    stream: MediaStream;
    roomId: string;
    userId: string;
    userName: string;
}


export class WebConnection {
    props: WebConnectionProps;
    outbound: RTCPeerConnection;
    inbound: Array<RTCPeerConnection>;
    constructor(props: WebConnectionProps) {
        if (!props.stream) return;
        let { stream } = props;
        this.props = props;
        this.outbound = this.newRTCConnection();
        stream.getTracks().forEach(track => {
            this.outbound.addTrack(track, stream);
        });
        this.outbound.createOffer().then(offer => {
            this.outbound.setLocalDescription(offer);

        })

        this.handleOutboundInit();
        console.log("outbound", this.outbound)
        this.inbound = [];

    }

    newRTCConnection(): RTCPeerConnection {
        return new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302'
                }
            ]
        })
    }

    handleOutboundInit() {
        this.outbound.onconnectionstatechange = (e) => {
            console.log("pc.onconnectionstatechange", e);
        }
        this.outbound.onicecandidate = (e) => {
            if (e.candidate === null) {
                let { roomId, userId, userName } = this.props;
                let { sdp, type } = this.outbound.localDescription;

                console.log("We have a SDP: ", this.outbound.localDescription);
            }
        }

    }
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

