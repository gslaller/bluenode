package controller

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gslaller/bluenode/backend/service"
)

func HandleSendJoin(c *gin.Context) {

	var sessionDescription service.ExtendedSessionDescription

	if err := c.BindJSON(&sessionDescription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ans, err := service.Connection.HandleInboundRequest(&sessionDescription)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if jsonParsed, err := json.Marshal(ans); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		c.String(http.StatusOK, string(jsonParsed))
	}

}

func HandleReciveJoin(c *gin.Context) {

	var sessionDescription service.ExtendedSessionDescription

	if err := c.BindJSON(&sessionDescription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ans, err := service.Connection.HandleOutboundRequest(&sessionDescription)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if jsonParsed, err := json.Marshal(ans); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		c.String(http.StatusOK, string(jsonParsed))
	}

}
