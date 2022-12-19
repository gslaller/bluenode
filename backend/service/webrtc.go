package service

import (
	"errors"
	"fmt"
	"io"
	"time"

	"github.com/pion/rtcp"
	"github.com/pion/webrtc/v3"
)

type ExtendedSessionDescription struct {
	Type string `json:"type"`
	SDP  string `json:"sdp"`

	UserId   string `json:"userId"`
	UserName string `json:"userName"`
	RoomId   string `json:"roomId"`
}

const (
	rtcpPLIInterval = time.Second * 3
)

type connection struct {
	peerConnection []*webrtc.PeerConnection
	localTrack     *webrtc.TrackLocalStaticRTP
}

var Connection connection

func init() {
	Connection = connection{
		peerConnection: make([]*webrtc.PeerConnection, 0, 10),
		localTrack:     nil,
	}
}

func (c *connection) HandleInboundRequest(sdp *ExtendedSessionDescription) (*webrtc.SessionDescription, error) {
	if c.localTrack != nil {
		return nil, errors.New("localTrack already exists")
	}
	fmt.Println("HandleInboundRequest")

	offer := webrtc.SessionDescription{}
	offer.SDP = sdp.SDP
	offer.Type = webrtc.SDPTypeOffer
	offer.Unmarshal()

	peerConnectionConfig := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	}

	peerConnection, err := webrtc.NewPeerConnection(peerConnectionConfig)
	c.peerConnection = append(c.peerConnection, peerConnection)
	fmt.Println("peerConnectionLength: ", len(c.peerConnection))

	if err != nil {
		panic(err)
	}

	// The closer function has to be handled

	// defer func() {
	// 	if cErr := peerConnection.Close(); cErr != nil {
	// 		fmt.Printf("cannot close peerConnection: %v\n", cErr)
	// 	}
	// }()

	// Allow us to receive 1 video track
	if _, err = peerConnection.AddTransceiverFromKind(webrtc.RTPCodecTypeVideo); err != nil {
		panic(err)
	}

	// if _, err = peerConnection.AddTransceiverFromKind(webrtc.RTPCodecTypeAudio); err != nil {
	// panic(err)
	// }

	// localTrackChan := make(chan *webrtc.TrackLocalStaticRTP)

	// Set a handler for when a new remote track starts, this just distributes all our packets
	// to connected peers
	peerConnection.OnTrack(func(remoteTrack *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {

		fmt.Println("There is a inbound track")

		// fmt.Printf("RemoteTrack has started, +%#v", remoteTrack)
		// fmt.Printf("Receiver has started, +%#v", receiver)

		// Send a PLI on an interval so that the publisher is pushing a keyframe every rtcpPLIInterval
		// This can be less wasteful by processing incoming RTCP events, then we would emit a NACK/PLI when a viewer requests it

		go func() {
			ticker := time.NewTicker(rtcpPLIInterval)
			for range ticker.C {
				if rtcpSendErr := peerConnection.WriteRTCP([]rtcp.Packet{&rtcp.PictureLossIndication{MediaSSRC: uint32(remoteTrack.SSRC())}}); rtcpSendErr != nil {
					fmt.Println(rtcpSendErr)
				}
			}
		}()

		// Create a local track, all our SFU clients will be fed via this track
		localTrack, newTrackErr := webrtc.NewTrackLocalStaticRTP(remoteTrack.Codec().RTPCodecCapability, "video", sdp.UserId)
		if newTrackErr != nil {
			panic(newTrackErr)
		}

		c.localTrack = localTrack
		// localTrackChan <- localTrack

		rtpBuf := make([]byte, 1400)
		for {
			i, _, readErr := remoteTrack.Read(rtpBuf)

			if readErr != nil {
				panic(readErr)
			}

			// ErrClosedPipe means we don't have any subscribers, this is ok if no peers have connected yet
			if _, err = localTrack.Write(rtpBuf[:i]); err != nil && !errors.Is(err, io.ErrClosedPipe) {
				panic(err)
			}
		}
	})

	// Set the remote SessionDescription
	err = peerConnection.SetRemoteDescription(offer)
	if err != nil {
		panic(err)
	}

	// Create answer
	answer, err := peerConnection.CreateAnswer(nil)
	if err != nil {
		panic(err)
	}

	// Create channel that is blocked until ICE Gathering is complete
	gatherComplete := webrtc.GatheringCompletePromise(peerConnection)

	// Sets the LocalDescription, and starts our UDP listeners
	err = peerConnection.SetLocalDescription(answer)
	if err != nil {
		panic(err)
	}

	// Block until ICE Gathering is complete, disabling trickle ICE
	// we do this because we only can exchange one signaling message
	// in a production application you should exchange ICE Candidates via OnICECandidate
	<-gatherComplete

	return peerConnection.LocalDescription(), nil

}

func (c *connection) HandleOutboundRequest(sdp *ExtendedSessionDescription) (*webrtc.SessionDescription, error) {

	fmt.Println("HandleOutboundRequest")
	fmt.Println("HandleOutboundRequest")

	offer := webrtc.SessionDescription{}
	offer.SDP = sdp.SDP
	offer.Type = webrtc.SDPTypeOffer
	offer.Unmarshal()

	peerConnectionConfig := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	}

	peerConnection, err := webrtc.NewPeerConnection(peerConnectionConfig)
	if err != nil {
		panic(err)
	}

	c.peerConnection = append(c.peerConnection, peerConnection)

	rtpSender, err := peerConnection.AddTrack(c.localTrack)
	if err != nil {
		panic(err)
	}

	// Read incoming RTCP packets
	// Before these packets are returned they are processed by interceptors. For things
	// like NACK this needs to be called.
	go func() {
		rtcpBuf := make([]byte, 1500)
		for {
			if _, _, rtcpErr := rtpSender.Read(rtcpBuf); rtcpErr != nil {
				return
			}
		}
	}()

	// Set the remote SessionDescription
	err = peerConnection.SetRemoteDescription(offer)
	if err != nil {
		panic(err)
	}

	// Create answer
	answer, err := peerConnection.CreateAnswer(nil)
	if err != nil {
		panic(err)
	}

	// Create channel that is blocked until ICE Gathering is complete
	gatherComplete := webrtc.GatheringCompletePromise(peerConnection)

	// Sets the LocalDescription, and starts our UDP listeners
	err = peerConnection.SetLocalDescription(answer)
	if err != nil {
		panic(err)
	}

	// Block until ICE Gathering is complete, disabling trickle ICE
	// we do this because we only can exchange one signaling message
	// in a production application you should exchange ICE Candidates via OnICECandidate
	<-gatherComplete
	return peerConnection.LocalDescription(), nil

	// Get the LocalDescription and take it to base64 so we can paste in browser

}
