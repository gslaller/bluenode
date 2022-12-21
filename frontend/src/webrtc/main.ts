import { JoinRoom, JoinRecieveRoom } from "../rest/room";
import { getUserMedia } from "../utils/userMedia";

interface WebConnectionProps {
    roomId: string;
    userId: string;
    userName: string;
}

export class WebConnection {

    outboundStream: MediaStream = new MediaStream();
    datachannel: RTCDataChannel;
    props: WebConnectionProps;

    outbound: RTCPeerConnection;
    audioTransceiver: RTCRtpTransceiver;
    videoTransceiver: RTCRtpTransceiver;

    inbound: RTCPeerConnection;
    channelName = "text";
    sendMessageQueue: Array<(data: string) => void> = [];
    constraints: MediaStreamConstraints = {};
    // messages = new Array<string>();

    newTrackCallback: () => void;


    constructor(props: WebConnectionProps) {
        this.props = props;
    }

    async CleanUp() {
        console.log("CleanUp")
        if (this.outboundStream) {
            this.outboundStream.getTracks().forEach(track => track.stop());
        }

        if (this.outbound) {
            this.outbound.close();
        }

        if (this.inbound) {
            this.inbound.close();
        }
    }

    toggleVideo() {
        let videoTrack = this.outboundStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
    }

    toggleAudio() {
        let audioTrack = this.outboundStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
    }

    async handleOutboundInit(constraints: MediaStreamConstraints): Promise<MediaStream> {
        this.constraints = constraints;
        return new Promise(async (resolve, reject) => {


            let outbound = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' },],
            });

            this.datachannel = outbound.createDataChannel(this.channelName);
            this.createOutboundChannel();

            this.audioTransceiver = outbound.addTransceiver('audio', { direction: 'sendonly' });
            this.videoTransceiver = outbound.addTransceiver('video', { direction: 'sendonly' });

            // tracks are addeded

            outbound.createOffer().then(offer => {
                outbound.setLocalDescription(offer);
            });

            outbound.onconnectionstatechange = (e) => {
                console.log("pc.onconnectionstatechange", e);
            };

            outbound.onicecandidate = (e) => {
                if (e.candidate === null) {
                    resolve(this.outboundStream);
                }
            }

            this.outbound = outbound;

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

    async addMedia() {
        let stream = await getUserMedia(this.constraints);

        for (let track of stream.getTracks()) {
            this.outboundStream.addTrack(track);
        }

        let videoTrack = stream.getVideoTracks()[0];
        let audioTrack = stream.getAudioTracks()[0];

        this.audioTransceiver.sender.replaceTrack(audioTrack);
        this.videoTransceiver.sender.replaceTrack(videoTrack);

        this.newTrackCallback();

    }

    registerNewTrackCallback(callback: () => void) {
        this.newTrackCallback = callback;
    }


    // For the time being there is only a single inbound peer connection possible
    async handleInboundInit(): Promise<MediaStream | null> {
        return new Promise((resolve, reject) => {

            let inbound = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' },],
            });

            this.inbound = inbound;
            this.datachannel = this.inbound.createDataChannel(this.channelName);
            this.createOutboundChannel();

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

    async createOutboundChannel() {
        console.log("createOutboundChannel")
        this.datachannel.onmessage = (e) => {
            // this.messages.push(e.data);
            this.emitSendMessage(e.data)
        }

        this.datachannel.onopen = (e) => {
            console.log("datachannel.onopen", e);

        }

        this.datachannel.onerror = (e) => {
            console.error("datachannel.onerror", e);
        }
    }

    sendMessage(message: string) {
        if (this.datachannel && this.datachannel.readyState === "open") {
            this.datachannel.send(message);
        }
    }

    emitSendMessage(message: string) {
        this.sendMessageQueue.forEach((f) => {
            f(message);
        })
    }

    recieveMessage(send: (data: string) => void) {
        this.sendMessageQueue.push(send);
    }


    changeVideoConstraints(constraints: MediaTrackConstraints) {
        let videoTrack = this.outboundStream.getVideoTracks()[0];
        videoTrack.applyConstraints(constraints);
    }

    async chageToScreenShare() {
        let videoTrack = this.outboundStream.getVideoTracks()[0];
        let stream = await navigator.mediaDevices.getDisplayMedia();
        let screenTrack = stream.getVideoTracks()[0];
        let sender = this.outbound.getSenders().find(s => s.track.kind === "video");
        sender.replaceTrack(screenTrack);
        videoTrack.stop();
        this.outboundStream.removeTrack(videoTrack);
        this.outboundStream.addTrack(screenTrack);
    }

    async changeToCamera() {
        let videoTrack = this.outboundStream.getVideoTracks()[0];
        let stream = await navigator.mediaDevices.getUserMedia(this.constraints);
        let streamTrack = stream.getVideoTracks()[0];
        let sender = this.outbound.getSenders().find(s => s.track.kind === "video");
        sender.replaceTrack(streamTrack);
        videoTrack.stop();
        this.outboundStream.removeTrack(videoTrack);
        this.outboundStream.addTrack(streamTrack);

    }
}
