import BioEditor from './bio-editor';
import ProfilePic from './profile-pic';

export default function Profile (props) {
    const { first, last, imageUrl, bio, setBio, onClick } = props;
    console.log('ImageUrl: ', imageUrl);

    return (
        <>
            <div className="profile">
                {/* <h1>
                    {first} {last}
                </h1> */}
                <div className="editProfPic">
                    <ProfilePic first={first} last={last} imageUrl={imageUrl} />
                    <button onClick={() => onClick()}>
                        Edit
                    </button>
                </div>
                <BioEditor bio={bio} setBio={(userBio) => setBio(userBio)} />
            </div>
        </>
    );
}