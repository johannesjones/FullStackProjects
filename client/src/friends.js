import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getFriends, acceptFriendsReq, unfriend } from './actions';

export default function Friends () {
    const dispatch = useDispatch();

    const wannabies = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter(
                (friend) =>
                    friend.accepted == false && friend.sender_id == friend.id
            )
    );
    console.log('Wannabies: ', wannabies);

    const actualFriends = useSelector(
        (state) =>
            state.friends && state.friends.filter(
                (friend) => friend.accepted
            )
    );

    const pending = useSelector(
        (state) =>
            state.friends && state.friends.filter(
                (friend) => friend.accepted == false && friend.recipient_id == friend.id
            )
    );


    useEffect(() => {
        console.log('Load site');
        dispatch(getFriends());
    }, []);

    if (!actualFriends) {
        return null;
    }

    return (
        <>
            <h2>These people are your Friends:</h2>
            <div className="friends">
                {actualFriends &&
                    actualFriends.map((friend, index) => (
                        <div className="friends-existing" key={index}>
                            <p>
                                <strong>
                                    {friend.first} {friend.last}
                                </strong>
                            </p>
                            <img
                                src={friend.profile_pic_url || "/default.png"}
                                alt={`${friend.first} ${friend.last}`}
                            />
                            <div>
                                <button
                                    className="unfriendBtn"
                                    onClick={() =>
                                        dispatch(unfriend(friend.id))
                                    }
                                >
                                    End friendship
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
            <h2>Pending Requests:</h2>
            <div className="pending">
                {pending &&
                    pending.map((elem, index) => {
                        return (
                            <div className="pending-existing" key={index}>
                                <p>
                                    <strong>
                                        {elem.first} {elem.last}
                                    </strong>
                                </p>
                                <img
                                    src={elem.profile_pic_url}
                                    alt={`${elem.first} ${elem.last}`}
                                />
                                <div>
                                    <button
                                        className="unfriendBtn"
                                        onClick={() =>
                                            dispatch(unfriend(elem.id))
                                        }
                                    >
                                        Cancel request
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <h2>These people want to be your Friends:</h2>
            <div className="wannabies">
                {wannabies &&
                    wannabies.map((bee, index) => {
                        return (
                            <div className="wannabies-existing" key={index}>
                                <p>
                                    <strong>
                                        {bee.first} {bee.last}
                                    </strong>
                                </p>
                                <img
                                    src={bee.profile_pic_url}
                                    alt={`${bee.first} ${bee.last}`}
                                />
                                <div>
                                    <button
                                        className="acceptBtn"
                                        onClick={() =>
                                            dispatch(acceptFriendsReq(bee.id))
                                        }
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="unfriendBtn"
                                        onClick={() =>
                                            dispatch(unfriend(bee.id))
                                        }
                                    >
                                        Deny
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </>
    );

}