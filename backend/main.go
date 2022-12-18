package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/pion/webrtc/v3"
)

func init() {
	fmt.Println(gin.Version)
	fmt.Println(webrtc.MimeTypeOpus)
	fmt.Println("Hello World!, from the container build")
}

func main() {
	router := gin.New()
	Controller(router)
	router.Run(":8080")
}
