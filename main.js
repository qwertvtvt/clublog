const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const cors = require('cors');
const config = require("./config.json");
const knex = require("./knex");

const PORT = config.port;
const Version = config.version;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "www")));

const endpointsPath = path.join(__dirname, "endpoints");
fs.readdirSync(endpointsPath).filter(function(file) {
    return path.extname(file) === ".js";
}).forEach(function(file) {
    const route = require(path.join(endpointsPath, file));
    app.use("/", route);
});

http.listen(PORT, function() {
    console.log(`${Version} started on *:${PORT}`);
});
