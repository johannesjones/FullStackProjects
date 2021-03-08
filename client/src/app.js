import axios from './axios';
import { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import Logo from './logo';
import ProfilePic from './profile-pic';
import Uploader from './uploader';
import Profile from './profile';
import OtherProfile from './otherprofile';
import FindPeople from './findpeople';
import Friends from './friends';
import Chat from './chat';

export class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploaderVisible: false,
        };
    }

    componentDidMount() {
        axios
            .get("/api/user")
            .then(({ data }) => {
                // console.log("+++++++Data: ", data);
                this.setState(data.rows);
            })
            .catch((err) => {
                console.log("Error axios user: ", err);
            });
    }

    toggleUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    updateProfilePic(imageUrl) {
        console.log("Update Pic!", imageUrl);
        this.setState({ profile_pic_url: imageUrl, uploaderVisible: false });
    }

    setBio(userBio) {
        console.log('E in setBio in App: ', userBio);
        this.setState(
            {
                bio: userBio,
            },
            () => console.log("this.state: ", this.state)
        );
    }

    render() {
        if (!this.state.id) {
            return null;
        }

        return (
            <>
                <BrowserRouter>
                    <div className="app">
                        <div className="header">
                            <Logo />
                            <h2 id="logoText">Rhizome</h2>

                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.profile_pic_url}
                                onClick={() => this.toggleUploader()}
                                size="small"
                            />
                            <h2 id="username">
                                {this.state.first} {this.state.last}
                            </h2>
                        </div>
                        <div className="navBar">
                            <Link to="/">
                                <button>My Profile</button>
                            </Link>
                            <Link to="/users">
                                <button>Find People</button>
                            </Link>
                            <Link to="/friends">
                                <button>Friends</button>
                            </Link>
                            <Link to="/chat">
                                <button>Chat</button>
                            </Link>
                            <a href="/logout">Logout</a>
                        </div>

                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.profile_pic_url}
                                    size="large"
                                    onClick={() => this.toggleUploader()}
                                    bio={this.state.bio}
                                    setBio={(userBio) => this.setBio(userBio)}
                                />
                            )}
                        />

                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/users"
                            render={() => (
                                <FindPeople
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.profile_pic_url}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/friends"
                            render={(props) => (
                                <Friends
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                    // userId={this.state.id}
                                />
                            )}
                        />

                        <Route path="/chat" component={Chat} />

                        {this.state.uploaderVisible && (
                            <div id="overlay">
                                <Uploader
                                    updateProfilePic={(imageUrl) =>
                                        this.updateProfilePic(imageUrl)
                                    }
                                />
                            </div>
                        )}
                        <div className="footer">
                            <img src="Rhizom.jpeg"/>
                        </div>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}