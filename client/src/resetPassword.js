// src/resetpassword.js
import { Component } from 'react';
import axios from "./axios";
import { Link } from "react-router-dom";



export default class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            renderView: 1,
            error: false,
            error1: false,
            error2: false,
            // error3: false,
            // error4: false
        };
    }

    whichView() {
        if (this.state.renderView === 1) {
            return (
                <>
                    <div className="resetPw">
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="email"
                            placeholder="Enter your email"
                        />
                        <button onClick={() => this.handleFirstClick()}>
                            Submit
                        </button>
                        <Link to="/login">
                            <button id='back'>← Back to Login</button>
                        </Link>
                    </div>
                </>
            );
        } else if (this.state.renderView === 2) {
            return (
                <>
                    <div className='resetPw'>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            value=''
                            name="password"
                            placeholder="New Password"
                        />
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="code"
                            placeholder="Verification Code"
                        />
                        <button onClick={() => this.handleSecondClick()}>
                            Submit
                        </button>
                    </div>
                </>
            );
        } else if (this.state.renderView === 3) {
            return (
                <>
                    <div className="resetPw">
                        <h1>Success!</h1>
                        <Link to="/login">
                            <button>Back to login</button>
                        </Link>
                    </div>
                </>
            );
        }
    }

    handleFirstClick() {
        axios
            .post("/password/reset/start", this.state)
            .then((resp) => {
                console.log("Response: ", resp);
                // look at resp
                if (!resp.data.success) {
                    this.setState({
                        renderView: 2,
                    });
                } else {
                    this.setState({
                        error1: true
                    });
                    // location.replace("/password/reset/start");
                }
            })
            .catch((err) => {
                console.log("Err in resetPwStart: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    handleSecondClick() {
        axios
            .post("/password/reset/verify", this.state)
            .then((resp) => {
                console.log("Response: ", resp);
                // look at resp
                if (!resp.data.success) {
                    this.setState({
                        renderView: 3,
                    });
                } else {
                    this.setState({
                        error2: true
                    });
                }
            })
            .catch((err) => {
                console.log("Err in resetPwVerify: ", err);
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
                <div className="resetPwView">
                    <h1>Reset Password</h1>
                    {this.whichView()}
                </div>
                {this.state.error1 && (
                    <p>Please enter your email address again!</p>
                )},
                {this.state.error2 && (
                    <p>The code you entered is incorrect or has expired!</p>
                )},
                {this.state.error && (
                    <p>Something went wrong in registration!</p>
                )}
            </>
        );
    }
}