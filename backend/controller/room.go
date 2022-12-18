package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ExtendedSessionDescription struct {
	Type string `json:"type"`
	SDP  string `json:"sdp"`

	UserId   string `json:"userId"`
	UserName string `json:"userName"`
	RoomId   string `json:"roomId"`
}

func HandleJoin(c *gin.Context) {

	var sessionDescription ExtendedSessionDescription

	if err := c.BindJSON(&sessionDescription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if sessionDescription.Type == "offer" {
		// sdp := webrtc.SessionDescription{
		// 	Type: webrtc.SDPTypeOffer,
		// 	SDP:  sessionDescription.SDP,
		// }

		// create a new peer connection
		// create a new data channel
		// set the remote description
		// create an answer
		// set the local description
		// send the answer back to the client
	} else if sessionDescription.Type == "answer" {
		// set the remote description
	} else if sessionDescription.Type == "candidate" {
		// add ice candidate
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "message from gurpreet",
	})
}
