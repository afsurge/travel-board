const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config.json");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            // console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error getting all images:", err.message);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("Server POST route hit");
    // console.log("req.file: ", req.file);
    // console.log("req.body: ", req.body);
    // insert into images table the uploaded file info
    // title, description, username, fullUrl (aws+filename)
    // aws link included in config.json (s3Url)
    // response json with object containing all above info
    // back to script in axios then() for next step
    // replace if-else below with db query -> then response -> catch error

    const { title, description, username } = req.body;
    const { filename } = req.file;
    const fullUrl = config.s3Url + filename;
    db.addImage(fullUrl, username, title, description)
        .then(() => {
            res.json({
                title: title,
                description: description,
                username: username,
                url: fullUrl,
                success: true,
            });
        })
        .catch((err) => {
            console.log("Error in db.addImage:", err.message);
            res.json({
                success: false,
            });
        });
});

app.get("/images/:id", (req, res) => {
    const selectedId = req.params.id;
    console.log("Selected id received from script:", selectedId);
    db.getSelImage(selectedId)
        .then(({ rows }) => {
            // console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error getting selected image details:", err.message);
        });
});

app.get("/more/:lowestId", (req, res) => {
    const lowestId = req.params.lowestId;
    console.log("Lowest id received from script: ", lowestId);
    db.getMoreImages(lowestId)
        .then(({ rows }) => {
            // console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error getting more images:", err.message);
        });
});

app.listen(8080, () => console.log("🖼️  IB server (port: 8080) online..."));
