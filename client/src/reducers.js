export function reducer (state = {}, action) {
    // if-statements to check actio and then modify state
    if (action.type === 'RECEIVE_FRIENDS') {
        console.log('Action: ', action);
        state = {
            ...state,
            friends: action.friends,
        };
    }

    if (action.type === "ACCEPT_FRIEND") {
        state = {
            ...state,
            friends: state.friends.map((friend) => {
                if (friend.id === action.viewed) {
                    return {
                        ...friend,
                        accepted: true
                    };
                } else {
                    return friend;
                }
            })
        };
    }

    if (action.type === "UN_FRIEND") {
        state = {
            ...state,
            friends: state.friends.filter((friend) => {
                if (friend.id != action.viewed) {
                    return {
                        ...friend,
                        accepted: false,
                    };
                }
            }),
        };
    }

    if (action.type == 'MOST_RECENT_MSGs') {
        state = {
            ...state,
            msgs: action.msgs
        };
    }

    if (action.type == 'RECENT_MSG') {
        console.log('State: ', state.msgs);
        console.log('Action: ', action.msg);
        state = {
            ...state,
            msgs: [...state.msgs, action.msg]
        };
    }

    return state;
}