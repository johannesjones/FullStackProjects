import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople () {
    const [name, setName] = useState('');
    const [names, setNames] = useState([]);
    // const [error, setError] = useState([]);
    
    useEffect(() => {
        let abort = false;
        axios
            .get(`/api/users/${name}`)
            .then(({ data }) => {
                console.log('Data in FindPeople: ', data);
                // let search = data.name;
                if (!abort) {
                    setNames(data.rows);
                }
            })
            .catch((err) => {
                console.log('Error in getting users by name: ', err);
            });
        return () => {
            abort = true;
        };
    }, [name]);

    return (
        <>
            <div className="searchPeople">
                <h2>Search</h2>
                <input
                    name="name"
                    type="text"
                    placeholder="(first)name to search"
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="off"
                />
            </div>
            <h3>Results:</h3>
            <div className="findPeople">
                {names.map((name, index) => {
                    return (
                        <div key={index} className="foundpeople">
                            <div className="peoplename">
                                <h3>
                                    {name.first} {name.last}
                                </h3>
                            </div>
                            <div kex={index} className="people_smallPic">
                                <Link to={`/user/${name.id}`}>
                                    <img
                                        src={name.profile_pic_url}
                                        alt={`${name.first} ${name.last}`}
                                    />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}


