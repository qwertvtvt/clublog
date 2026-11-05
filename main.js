const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const cors = require('cors');
const session = require("express-session");
const { ConnectSessionKnexStore } = require("connect-session-knex");
const knexConfig = require("./knexfile.js");
const knex = require("./knex.js");
const bcrypt = require("bcrypt");
const config = require("./config.json");

const PORT = config.port;
const Version = config.version;

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
    secret: process.env.SESSION_SECRET || "change-this",
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

const endpointsPath = path.join(__dirname, "endpoints");
fs.readdirSync(endpointsPath).filter(function(file) {
    return path.extname(file) === ".js";
}).forEach(function(file) {
    const route = require(path.join(endpointsPath, file));
    app.use("/api", route);
});

http.listen(PORT, function() {
    console.log(`${Version} started on *:${PORT}`);
});
