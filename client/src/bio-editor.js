import { Component } from 'react';
import axios from './axios';

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            error: false,
            errorMessage: '',
            draftBio: props.bio
        };
    }

    componentDidMount() {
        console.log('Props in Bioeditor compDidMount: ', this.props);
        this.setState({
            bio: this.props.bio,
        });
    }

    handleChange(e) {
        this.setState(
            {
                draftBio: e.target.value,
            },
            () => console.log("this.state in Bio-editor: ", this.state)
        );
    }

    toggleEditingMode() {
        this.setState({
            editing: !this.state.editing,
        });
    }

    setBio () {
        axios
            .post("/update-bio", this.state)
            .then(({ data }) => {
                console.log("Response setBio: ", data);
                if (!data.success) {
                    this.setState({
                        errorMessage: data.errorMessage,
                    });
                } else {
                    this.setState({
                        bio: data.rows,
                        editing: false
                    });
                    console.log('This.state in setBio: ', this.state);
                    this.props.setBio(data.rows);
                }
            })
            .catch((err) => {
                console.log("Err in update-bio: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        console.log("props in Bioeditor: ", this.props);
        if (this.state.editing) {
            return (
                <>
                    <div className='bioEditor'>
                        <h3>Editing: </h3>
                        <textarea cols='50' rows='15'
                            name="draftBio"
                            defaultValue={this.props.bio}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button onClick={() => this.setBio()}>Save</button>
                    </div>
                    {this.state.error && (
                        <p>Something went wrong in adding Bio!</p>
                    )}
                    {this.state.errorMessage && <p>${this.errorMessage}</p>}
                </>
            );
        } else {
            return (
                <>
                    <div className="bioEditor">
                        <h2>About me:</h2 >
                        <p>{this.props.bio}</p>
                        <button onClick={() => this.toggleEditingMode()}>
                           Edit
                        </button>
                    </div>
                </>
            );
        }
    }
}