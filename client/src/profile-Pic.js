export default function ProfilePic(props) {
    console.log('Props: ', props);
    const { imageUrl, first, last, toggleUploader, size = "" } = props;

    return (
        <>
            <img
                onClick={toggleUploader}
                src={imageUrl || "default.png"}
                alt={`${first} ${last}`}
                className={`${size}`}
            />

        </>
    );
}