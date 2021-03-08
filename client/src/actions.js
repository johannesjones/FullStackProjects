import axios from './axios';

export async function getFriends () {
    try {
        const { data } = await axios.get('/api/friends-wannabies');
        console.log('++Data: ', data);
        return {
            type: "RECEIVE_FRIENDS",
            friends: data.rows,
        };
    } catch (error) {
        console.log('Err in getting Friends data: ', error);
    }

}

export async function acceptFriendsReq (viewed) {
    try {
        const { data } = await axios.post('/api/friendships/', {text: 'Accept request', viewed: viewed});
        console.log(data);
        return {
            type: "ACCEPT_FRIEND",
            viewed: viewed,
        };
    } catch (error) {
        console.log('ERR in post accept friend: ', error);
    }
}

export async function unfriend (viewed) {
    try {
        const { data } = await axios.post('/api/friendships', {text: 'End friendship', viewed: viewed});
        console.log(data);
        return {
            type: "UN_FRIEND",
            viewed: viewed,
        };
    } catch (error) {
        console.log("ERR in post unFriend: ", error);
    }
}

export async function receiveRecentMsgs (msgs) {

    try {
        return {
            type: "MOST_RECENT_MSGs",
            msgs: msgs,
        };
    } catch (err) {
        console.log("Err in receiveRecentMsgs: ", err);
    }
}

export async function receiveNewMsg (msg) {
    try {
        return {
            type: "RECENT_MSG",
            msg: msg,
        };
    } catch (err) {
        console.log("Err in receiveNewMsg: ", err);
    }
}