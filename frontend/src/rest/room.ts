import { URL, BaseFetch } from "./utils"



async function CreateRoom() {
    /**
     * This should be a subroutine fo the JoinRoom function
     * the join api call creates a room if it doesn't exist
     * or otherwise joins the room which already exists
     */
    let ans = await BaseFetch("/room", "POST", {});
    let data = await ans.json();
    return data;

}

async function JoinRoom(obj: {
    roomId: string,
    userId: string,
    userName: string,
    type: string,
    sdp: string,
}) {

}

async function DeleteRoom() {

}

async function ListRooms() {

}

export {
    CreateRoom,
    JoinRoom,
    DeleteRoom,
    ListRooms

}