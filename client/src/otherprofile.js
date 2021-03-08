import { Component } from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';
import Friendships from './friendbutton';

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            first: this.props.first,
            last: this.props.last,
            imageUrl: this.props.imageUrl,
            bio: this.props.bio,
            error: false
        };
    }

    componentDidMount () {
        // axios req to server to get other user's information when it mounts
        console.log('this.props.match: ', this.props.match.params.id);
        
        axios
            .get(`/api/user/${this.props.match.params.id}`)
            .then(({ data }) => {
                console.log('Data in otherprofile: ', data.rows);
                if (!data.success) {
                    this.setState({
                        errorMessage: data.errorMessage,
                    });
                } else {
                    this.setState({
                        id: data.rows.id,
                        first: data.rows.first,
                        last: data.rows.last,
                        imageUrl: data.rows.profile_pic_url,
                        bio: data.rows.bio,
                    });
                }
                if (this.props.match.params.id == data.userId) {
                    this.props.history.push("/");
                }
            })
            .catch((err) => {
                console.log("Error axios user: ", err);
                this.setState({
                    error: true
                });
            });
    }

    render () {
        if (this.state.id) {
            return (
                <>
                    <div className="otherUser">
                        <Link to="/users">
                            <button id='back2search'>← Back to search</button>
                        </Link>
                        <h3>
                            {this.state.first} {this.state.last}
                        </h3>
                        <img
                            className="otherProfPic"
                            src={this.state.imageUrl}
                            alt={`${this.state.first} ${this.state.last}`}
                        />
                        <p id='bio'>{this.state.bio}</p>
                        <Friendships viewed={this.props.match.params.id} />
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="userNotFound">
                        <img src="/user-not-found.png" />
                        <p id="errorOtherUser">{this.state.errorMessage}</p>
                        {this.state.error && (
                            <p id="errorOtherUser">
                                Something went wrong in otherProfile!
                            </p>
                        )}
                        <div className='BackLink'>
                            <p>Back to </p>
                            <Link to="/">
                                <button>My Profile</button>
                            </Link>
                        </div>
                    </div>
                </>
            );
        }
        
    }
}
