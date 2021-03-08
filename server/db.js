// Queries
const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);


exports.addRegist = (first, last, email, password) => {
    return db.query(
        `
    
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) 
        RETURNING id
    
    `,
        [first, last, email, password]
    );
};

exports.addProfilePic = (url, userId) => {
    return db.query(
        `
        
        UPDATE users
        SET profile_pic_url = $1
        WHERE id = $2
        RETURNING profile_pic_url
        
    `,
        [url, userId]
    );
};

exports.addReset = (code, email) => {
    return db.query(
        `
        
        INSERT INTO reset_codes (code, email)
        VALUES ($1, $2) 
        RETURNING email
        
        `,
        [code, email]
    );
};

exports.addBio = (bio, userId) => {
    return db.query(
        `

        UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING bio

    `,
        [bio, userId]
    );
};
 
exports.getLoginInfo = (email) => {
    return db.query(
        `

        SELECT * FROM users
        WHERE email = $1
    
    `,
        [email]
    );
};
    
exports.getCode = (email) => {
    return db.query(
        `

        SELECT * FROM reset_codes
        WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes' 
        AND email = $1

    `,
        [email]
    );
};

exports.updatePw = (pw, email) => {
    return db.query(
        `

        UPDATE users
        SET password = $1
        WHERE email = $2

    `,
        [pw, email]
    );
};

exports.getUserData = (userId) => {
    return db.query(
        `
    
        SELECT id, bio, first, last, profile_pic_url from users
        WHERE id = $1
    
    `,
        [userId]
    );
};

exports.getRecentUsers = () => {
    return db.query(
        `
        
        SELECT id, bio, first, last, profile_pic_url FROM users 
        ORDER BY id DESC 
        LIMIT 3
    
    `
    );
};

exports.getMatchingUsers = (name) => {
    return db.query(
        `
          
        SELECT id, bio, first, last, profile_pic_url FROM users 
        WHERE first ILIKE $1
          
    `,
        [name + "%"]
    );
};

exports.getFriends =  (viewing, viewed) => {
    return db.query(
        `
        
        SELECT * FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (sender_id = $1 AND recipient_id = $2)
        
    `,
        [viewing, viewed]
    );
};

exports.friendsRequest = (viewing, viewed) => {
    return db.query(
        `
        
        INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1, $2)

    `,
        [viewing, viewed]
    );
};

exports.acceptFriendsReq = (viewing, viewed) => {
    return db.query(
        `

        UPDATE friendships
        SET accepted = true
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (recipient_id = $1 AND sender_id = $2)

     `,
        [viewing, viewed]
    );
};

exports.endFriends = (viewing, viewed) => {
    return db.query(
        `

        DELETE FROM friendships
        WHERE (sender_id = $1 AND recipient_id = $2) 
        OR (recipient_id = $1 AND sender_id = $2)

    `,
        [viewing, viewed]
    );
};

exports.getFriendsWannabies = (userId) => {
    return db.query(
        `

        SELECT users.id, first, last, profile_pic_url, accepted, sender_id, recipient_id
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = false AND sender_id = $1 AND recipient_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)

    `,
        [userId]
    );
};

exports.getRecentMsgs = () => {
    return db.query(
        `

        SELECT messages.sender_id, messages.msg, messages.timestamp, users.first, users.last, users.profile_pic_url 
        FROM messages
        JOIN users
        ON messages.sender_id = users.id 
        ORDER BY messages.id DESC
        LIMIT 10

    `,);
};

exports.addMsg = (id, msg) => {
    return db.query(
        `
        
        INSERT INTO messages (sender_id, msg)
        VALUES ($1, $2) RETURNING timestamp

    `,
        [id, msg]
    );
};



