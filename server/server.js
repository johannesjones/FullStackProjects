const express = require("express");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const compression = require("compression");
const { sendEmail } = require("./ses");
const path = require("path");
// import cookie-session
const cookieSession = require("cookie-session");
const secret = require("./secrets").sessionSecret;
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
// AWS S3
const { uploader } = require("./uploads");
const s3 = require("./s3");
const s3Url = require("./config").s3Url;

const { hash, compare } = require("./bc");

const { addRegist, getLoginInfo, addReset, getCode, updatePw, getUserData, addProfilePic, addBio, getRecentUsers, getMatchingUsers, getFriends, friendsRequest, acceptFriendsReq, endFriends, getFriendsWannabies, getRecentMsgs, addMsg } = require("./db");

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

const cookieSessionMiddleware = cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    secret: secret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.json());

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get('/api/user', (req, res) => {
    getUserData(req.session.userId).then(({ rows }) => {
        res.json({ success: true, rows: rows[0] });
    })
        .catch((err) => {
            console.log('Error fetching userData: ', err);
            res.json({ success: false });
        });
});

app.get('/api/user/:id', async (req, res) => {
    try {
        const { rows } = await getUserData(req.params.id);
        if (rows.length) {
            res.json({ success: true, rows: rows[0], userId: req.session.userId});
        } else {
            res.json({
                success: false, errorMessage: "This user doesn't exist :(",
            });
        }
    } catch (err) {
        res.json({ success: false });
        console.log('Error in getUserData for other users: ', err);
    }
});

app.get('/api/users/:name?', async (req, res) => {
    let result;
    try {
        if (!req.params.name) {
            result = await getRecentUsers();
            res.json({ success: true, rows: result.rows });
        } else {
            result = await getMatchingUsers(req.params.name);
            res.json({ success: true, rows: result.rows });
        }
        // if (result.rows.length) {
        //     res.json({ name: req.params.name, rows: result.rows });
        // }

    } catch (err) {
        res.json({ success: false });
        console.log('Error in getting users by name: ', err);
    }
});

app.get('/api/friendships/:id', async (req, res) => {
    console.log('Inside get friends route');
    const { userId: viewing } = req.session;
    // console.log('Params: ', req.params);
    const { id: viewed } = req.params;
    // console.log('Viewing: ', viewing);
    // console.log("Viewed: ", viewed);

    try {
        const { rows } = await getFriends(viewing, viewed);
        console.log('Rows in getFriends: ', rows);
        // if (rows.length) {
        //     res.json({ success: true, rows: rows[0] });
        // }
        if (!rows.length) {
            res.json({ text: "⎆ Friendly Request" });

        } else if (!rows[0].accepted) {
            if (rows[0].sender_id == viewing) {
                res.json({ text: '⚙︎ pending/Cancel request'});
            } else if (rows[0].recipient_id == viewing) {
                res.json({ text: 'Accept request'});
            }
        } else if (rows[0].accepted) {
            res.json({ text: 'End friendship'});
        }
    } catch (err) {
        res.json({ success: false });
        console.log("Error in getFriends: ", err);
    }
});

app.post('/api/friendships', async (req, res) => {
    const { userId: viewing } = req.session;
    const { text, viewed } = req.body;

    if (text == '⎆ Friendly Request') {
        try {
            const { rows } = await friendsRequest(viewing, viewed);
            console.log('Rows friendsReq: ', rows);
            return res.json({ friendsRequest: true });
        } catch (err) {
            console.log('Err in friendsReq: ', err);
        }
    } else if (text == 'Accept request') {
        try {
            const { rows } = await acceptFriendsReq(viewing, viewed);
            console.log("Rows acceptFriendsReq: ", rows);
            return res.json({ acceptFriendsReq: true, viewed: viewed });
        } catch (err) {
            console.log('Err in acceptFriendsReq: ', err);
        }
    } else if (text == 'Cancel request' || text == 'End friendship') {
        try {
            const { rows } = await endFriends(viewing, viewed);
            console.log("Rows endFriends: ", rows);
            return res.json({ endFriends: true, viewed: viewed });
        } catch (err) {
            console.log('Err in endFriends: ', err);
        }
    } 
});

app.get('/api/friends-wannabies', async (req, res) => {
    try {
        const { rows } = await getFriendsWannabies(req.session.userId);
        console.log('Rows: ', rows);
        res.json({ success: true, rows: rows });
    } catch (err) {
        console.log('Error in getFriendsWannabies');
    }
});


app.post("/profile-pic", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    let url = `${s3Url}${filename}`;

    if (filename) {
        addProfilePic(url, req.session.userId).then(({ rows }) => {
            res.json({ success: true , profile_pic_url: rows[0].profile_pic_url });
        })
            .catch((err) => {
                console.log('Error in uploading ProfilePic: ', err);
                res.json({ success: false });
            });
    } else {
        res.json({ success: false });
        console.log('No file or file too large');
    }
});

app.post("/update-bio", async (req, res) => { 
    try {
        const { rows } = await addBio(req.body.draftBio, req.session.userId);
        if (rows.length) {
            res.json({ success: true, rows: rows[0].bio });
        } else {
            res.json({ success: false, errorMessage: "Unable to write bio" });
        }
    } catch {
        res.json({ success: false, errorMessage: "Error in addBio" });
    }   
});

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    if (email) {
        getLoginInfo(email).then(({ rows }) => {
            if (rows.length) {
                console.log("Email exists", rows[0].email);
                req.session.email = rows[0].email;
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                addReset(secretCode, email)
                    .then(() => {
                        let message = `This is the code to reset your password: ${secretCode}`;
                        let subject = "Password RESET";
                        sendEmail(email, message, subject)
                            .then(({ rows }) => {
                                res.json({ success: true, data: rows[0] });
                            })
                            .catch(() => {
                                res.json({ success: false, errorMessage: 'Problems sending email' });
                            });
                    })
                    .catch(() => {
                        res.json({ success: false });
                    });
            } else {
                res.json({ success: false, errorMessage: "Email doesn't exist!" });
            }
        });
    } else {
        res.json({ success: false, errorMessage: 'Please enter your email' });
    }
});

app.post("/password/reset/verify", (req, res) => {
    const { password, code } = req.body;
    const { email } = req.session.email;

    if (code && password) {
        getCode(email).then(({ rows }) => {
            if (rows.length) {
                if (rows[0].code === code) {
                    hash(password).then((hashedPw) => {
                        updatePw(hashedPw, email);
                        res.json({ success: true });
                    });
                } else {
                    res.json({ success: false });
                }
            } else {
                res.json({ success: false });
            }
        });
    } else {
        res.json({ success: false });
    }
});

app.post("/registration", express.json(), (req, res) => {
    const { first, last, email, password } = req.body;
    console.log('req.body: ',req.body);

    if (first && last && email && password) {
        hash(password).then((hashedPw) => {
            console.log(first, last, email, hashedPw);
            addRegist(first, last, email, hashedPw)
                .then(({ rows }) => {
                    console.log("user added", rows);
                    req.session.userId = rows[0].id;
                    res.json({ success: true, data: rows[0] });
                })
                .catch(() => {
                    res.json({ success: false });
                });
        });
    } else {
        res.json({ success: false, errorMessage: 'Please fill out all fields!' });
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        getLoginInfo(email)
            .then(({ rows }) => {
                if (compare(password, rows[0].password)) {
                    req.session.userId = rows[0].id;
                    res.json({ success: true, data: rows[0] });
                } else {
                    console.log("err in password");
                    res.json({ success: false });
                }
            })
            .catch(() => {
                res.json({ success: false });
            });
    } else {
        res.json({ success: false });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect('/welcome');
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});


server.listen(process.env.PORT || 3001, function () {
    console.log("SocialNetwork listening.");
});


io.on("connection", async (socket) => {
    // socket obj that is passed to callback represents network connection
    // b/w client server
    console.log(`socket with id ${socket.id} is now connected`);
    
    const { userId } = socket.request.session;
    console.log(`socket UserId: ${userId}`);
    
    if (!userId) {
        return socket.disconnect(true);
    }

    try {
        const { rows } = await getRecentMsgs();
        console.log('Rows: ', rows);
        socket.emit('mostRecentMsgs', rows.reverse());
    } catch (error) {
        console.log('ERR: ', error);
    }
    
    socket.on("chatMessage", async (text) => {
        try {
            console.log("Text: ", text);

            if (text) {

                const { rows: msgRows } = await addMsg(userId, text);
                const { rows } = await getUserData(userId);
                console.log('+++Rows: ', rows);
                const msg = {
                    first: rows[0].first,
                    last: rows[0].last,
                    profile_pic_url: rows[0].profile_pic_url,
                    timestamp: msgRows[0].timestamp,
                    msg: text,
                };
                io.emit("chatMessage", msg);
            }
        } catch (error) {
            console.log("Err in addMsg: ", error);
        }
    });

    
    

    

    // sends message to its own socket
    socket.emit("chatMessages", {
        payload: 'Array with 10 most recent',
    });

    // sends a message to ALL connected users

    // sends a message to all sockets EXCEPT your own
    socket.broadcast.emit("hello", {
        cohort: "adobo",
    });

    // sends a message to a specific socket (think private messaging)
    io.sockets.sockets.get(socket.id).emit("hello", {
        cohort: "Adobo",
    });

    // sends a message to every socket except 1
    io.sockets.sockets.get(socket.id).broadcast.emit("hello", {
        cohort: "Adobo",
    });

    socket.on("another cool message", function (data) {
        console.log(data);
    });

    socket.on("disconnect", function () {
        console.log(`socket with id ${socket.id} now disconnected`);
    });
});