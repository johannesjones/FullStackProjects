import axios from './axios';
import { Component } from 'react';


export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        };
        this.submit = this.submit.bind(this);
    }

    handleChange (e) {

        this.setState(
            {
                file: e.target.files[0],
            },
            () => console.log("this.state: ", this.state)
        );
    }


    submit() {
        const formData = new FormData();
        formData.append('file', this.state.file);
        
        // Axios req
        axios
            .post('/profile-pic', formData)
            .then(({ data }) => {
                console.log('Data: ', data);

                if (!data.success) {
                    this.setState({
                        error: true,
                    });
                } else {
                    this.props.updateProfilePic(data.profile_pic_url);
                }
            })
            .catch((err) => {
                console.log('Error in postProfilePic: ', err);
                this.setState({
                    error: true,
                });
            });
    }


    render () {
        return (
            <>
                <div className='uploader-overlay'>
                    <div className="uploader">
                        <input
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button onClick={this.submit}>Upload</button>
                    </div>
                </div>
            </>
        );
    }
}