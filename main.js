require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const cors = require('cors');
const session = require("express-session");
const { ConnectSessionKnexStore } = require("connect-session-knex");
const knex = require("./knex.js");
const config = require("./config.json");

const PORT = config.port;
const Version = config.version;

const SessionSecret = process.env.SESSION_SECRET;
if(!SessionSecret) throw new Error("SESSION_SECRET is required.");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "www")));

const store = new ConnectSessionKnexStore({
    knex: knex,
    tableName: "sessions",
    sidFieldName: "sid",
    createTable: true,
    cleanupInterval: 60000
});

app.use(session({
    name: "connect.sid",
    secret: SessionSecret,
    store: store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use("/api", require("./endpoints/test.js"));
app.use("/api/auth", require("./endpoints/auth"));
app.use("/api/users", require("./endpoints/users"));
app.use("/api/groups", require("./endpoints/groups"));
app.use("/api/groups", require("./endpoints/events"));
app.use("/api/groups", require("./endpoints/notices"));

http.listen(PORT, function() {
    console.log(`${Version} started on *:${PORT}`);
});
