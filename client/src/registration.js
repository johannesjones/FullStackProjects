// src/registration.js
// class components have state!
import { Component } from "react";
import axios from './axios';
import { Link } from "react-router-dom";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            errorMessage: ''
        };
        // this.handleChange = this.handleChange.bind(this);
    }

    // 1. we need to store the user's input in state
    // 2. when user clicks 'submit', we need to take the input we got from the user
    // and send it off to the server in a 'POST' request

    handleClick() {
        axios
            .post('/registration', this.state)
            .then(({ data }) => {
                console.log('Response: ', data);
                // look at resp
                if (!data.success) {
                    this.setState({
                        errorMessage: data.errorMessage,
                    });
                } else {
                    location.replace('/');
                }
            })
            .catch((err) => {
                console.log('Err in regist: ', err);
                this.setState({
                    error: true, 
                });
                // render error message
            });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            }, 
            () => console.log('this.state: ', this.state)
        );
    }
    
    render() {
        return (
            <>
                <div className="regist">
                    <h1>Registration</h1>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="first"
                        type="text"
                        placeholder="first"
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="last"
                        type="text"
                        placeholder="last"
                    />
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
                    <button onClick={() => this.handleClick()}>Submit</button>
                    {this.state.error && (
                        <p>Something went wrong in registration!</p>
                    )}
                    {this.state.errorMessage && (
                        <p>${this.errorMessage}</p>
                    )}
                </div>
                <h3 id='regist'>
                    If you are already a member, please{" "}
                    <Link to="/login">LogIn</Link>
                </h3>
            </>
        );
    }
} 