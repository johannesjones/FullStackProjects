import { receiveRecentMsgs, receiveNewMsg } from "./actions";
import { io } from 'socket.io-client';

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("mostRecentMsgs", (msgs) =>
            store.dispatch(receiveRecentMsgs(msgs))
        );

        socket.on("chatMessage", (msg) => store.dispatch(receiveNewMsg(msg)));
    }
};
