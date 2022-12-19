import { JoinRoom, JoinRecieveRoom } from "../rest/room";
import { getUserMedia } from "../utils/userMedia";

interface WebConnectionProps {
    roomId: string;
    userId: string;
    userName: string;
}

export class WebConnection {

    outboundStream: MediaStream;

    props: WebConnectionProps;
    outbound: RTCPeerConnection;
    inbound: RTCPeerConnection;

    constructor(props: WebConnectionProps) {
        this.props = props;
    }

    async handleOutboundInit(constraints: MediaStreamConstraints): Promise<MediaStream> {
        return new Promise(async (resolve, reject) => {

            let stream = await getUserMedia(constraints)
            this.outboundStream = stream;

            this.outbound = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' },],
            });

            // tracks are addeded
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
                    resolve(stream);
                }
            }

        });
    }

    async sendJoinRequest() {

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

    // For the time being there is only a single inbound peer connection possible
    async handleInboundInit(): Promise<MediaStream | null> {
        return new Promise((resolve, reject) => {

            let inbound = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' },],
            });

            this.inbound = inbound;
            // Add the video transceiver

            inbound.addTransceiver('video', { direction: 'recvonly' });
            inbound.addTransceiver('audio', { direction: 'recvonly' });

            inbound.createOffer().then(offer => {
                inbound.setLocalDescription(offer);
            });

            inbound.onconnectionstatechange = (e) => {
                console.log("pc.onconnectionstatechange", e);
            };

            inbound.onicecandidate = async (e) => {
                if (e.candidate === null) {
                    // Proceed with the fetch request
                    let { roomId, userId, userName } = this.props;
                    let { sdp, type } = inbound.localDescription;


                    let answer = await JoinRecieveRoom({ roomId, userId, userName, type, sdp });
                    // @ts-ignore
                    await inbound.setRemoteDescription(answer);
                    console.log("handleInboundInit the fetch request has been made with: ", answer);
                }
            }

            setTimeout(() => {
                reject("timeout")
            }, 3000);

            inbound.ontrack = (event) => {
                console.log("There is a track")
                let stream = event.streams[0]
                resolve(stream)
            }

        });
    }


}

