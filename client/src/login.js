import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleClick() {
        axios
            .post("/login", this.state)
            .then((resp) => {
                console.log("Response: ", resp);
                // look at resp
                if (!resp.data.success) {
                    this.setState({
                        error: true,
                    });
                } else {
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.log("Err in login: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state: ", this.state)
        );
    }

    render() {
        return (
            <>
                <div className="login">
                    <h1>Login</h1>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        type="text"
                        placeholder="email"
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                    <button onClick={() => this.handleClick()}>Log In</button>
                    {this.state.error && (
                        <p>Something went wrong while logging in!</p>
                    )}
                </div>
                <h3 id="loginh3">
                    Click <Link to="/resetPassword">Here</Link> if you forgot
                    your password
                </h3>
                <Link to="/">
                    <button id="back">← Back to Registration</button>
                </Link>
            </>
        );
    }
}
