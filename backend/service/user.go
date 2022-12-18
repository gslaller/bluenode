package service

import "time"

type User struct {
	id              string `json:"id"`
	name            string `json:"name"`
	iat             int64  `json:"iat"`
	lastInteraction int64  `json:"lastInteraction"`
}

func NewUser(id string, name string) *User {
	return &User{
		id:              id,
		name:            name,
		iat:             time.Now().Unix(),
		lastInteraction: time.Now().Unix(),
	}
}
