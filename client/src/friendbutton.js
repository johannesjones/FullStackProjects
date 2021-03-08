import { useState, useEffect } from "react";
import axios from "./axios";

export default function Friendships ({ viewed }) {
    const [text, setText] = useState('');
    const [click, setClick] = useState(false);
    // const [error, setError] = useState([]);
    
    useEffect(() => {
        console.log('Viewed: ', viewed);
        axios
            .get(`/api/friendships/${viewed}`)
            .then(({ data }) => {
                console.log('Data in Friends: ', data);
                setText(data.text);
            })
            .catch((err) => {
                console.log('Error in useFriends: ', err);
            });
    }, [click]);

    // console.log('Viewed: ', viewed);
    const postFriendStatus = () => {
        axios
            .post('/api/friendships', {text: text, viewed: viewed})
            .then(({ data }) => {
                console.log('Response postBtn: ', data);
                // console.log('Click: ', click);
                setClick(!click);
            })
            .catch((err) => {
                console.log('Err in posting Btn: ', err);
            });
    };
      
    return (
        <>
            <div className='friendbutton'>
                <button onClick={() => postFriendStatus()}>{text}</button>
            </div>
        </>
    );
        
}