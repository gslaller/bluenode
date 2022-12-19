import { JoinRoom } from "../rest/room";

interface WebConnectionProps {
    stream: MediaStream;
    roomId: string;
    userId: string;
    userName: string;
}

export class WebConnection {

    props: WebConnectionProps;
    type: string;
    sdp: string;
    outbound: RTCPeerConnection;
    inbound: Array<RTCPeerConnection>;

    constructor(props: WebConnectionProps) {
        if (!props.stream) return;
        this.props = props;
        this.type = "";
        this.sdp = "";

        this.handleOutboundInit();

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

        let { stream } = this.props;

        this.outbound = this.newRTCConnection();

        stream.getTracks().forEach(track => {
            this.outbound.addTrack(track, stream);
        });

        this.outbound.createOffer().then(offer => {
            this.outbound.setLocalDescription(offer);

        });

        this.outbound.onconnectionstatechange = (e) => {
            console.log("pc.onconnectionstatechange", e);
        };


        this.outbound.onicecandidate = (e) => {
            if (e.candidate === null) {

                this.sdp = this.outbound.localDescription.sdp;
                this.type = this.outbound.localDescription.type;

            }
        }

    }

    async sendJoinRequest() {

        if (this.sdp === "" || this.type === "") return;

        let { roomId, userId, userName } = this.props;
        let { sdp, type } = this.outbound.localDescription;
        let answer = await JoinRoom({ roomId, userId, userName, type, sdp });
        try {
            // @ts-ignore
            await this.outbound.setRemoteDescription(answer);
            console.log("answer", answer);
        } catch (e) {
            console.log("error", e);
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

