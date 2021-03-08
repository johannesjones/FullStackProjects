import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { socket } from "./socket";

export default function Chat () {

    const ref = useRef();

    const [ msg, setMsg ] = useState('');

    const msgs = useSelector((state) => state.msgs);

    useEffect(() => {
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [msgs]);

    const sendMsg = (e) => {
        e.preventDefault();
        socket.emit('chatMessage', msg);
        setMsg('');
    };

    return (
        <>
            <h2 id="chatHeadline">Community Chat</h2>
            <div className="chat">
                <div className="msgs" ref={ref}>
                    {msgs &&
                        msgs.map((msg, index) => (
                            <div className="msg" key={index}>
                                <img
                                    src={msg.profile_pic_url || "/default.png"}
                                />
                                <p>
                                    {msg.first} {msg.last}{" "}
                                    {new Intl.DateTimeFormat("en-GB", {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                    }).format(new Date(msg.timestamp))}
                                    <br></br>
                                    <br></br>
                                    &apos;
                                    <strong>
                                        {msg.msg}
                                        &apos;{" "}
                                    </strong>
                                </p>
                            </div>
                        ))}
                    <div className="chatInput">
                        <textarea
                            cols="30"
                            rows="5"
                            placeholder="type here"
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                        ></textarea>
                        <button onClick={(e) => sendMsg(e)}>Send</button>
                    </div>
                </div>
            </div>
        </>
    );
}
