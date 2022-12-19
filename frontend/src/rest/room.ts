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

type JoinRoomType = {
    roomId: string,
    userId: string,
    userName: string,
    type: string,
    sdp: string,
}


async function JoinRoom(obj: JoinRoomType) {

    let ans = await fetch(`${URL}/sendjoin`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })

    let data = await ans.json() as { type: string, sdp: string };
    return data;
};

async function JoinRecieveRoom(obj: JoinRoomType) {

    let ans = await fetch(`${URL}/recievejoin`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })

    let data = await ans.json() as { type: string, sdp: string };
    return data;
};

async function DeleteRoom() {

}

async function ListRooms() {

}

export {
    CreateRoom,
    JoinRoom,
    DeleteRoom,
    ListRooms,
    JoinRecieveRoom

}