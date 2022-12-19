package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gslaller/bluenode/backend/controller"
)

func CorsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Headers", "*")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func Controller(router *gin.Engine) {
	router.Use(CorsMiddleware())

	router.POST("/sendjoin", controller.HandleSendJoin)
	router.POST("/recievejoin", controller.HandleReciveJoin)
	router.GET("/ping", controller.Ping)
}
