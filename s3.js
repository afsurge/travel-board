const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("Error @upload: multer fail");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "travel-board",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then(function () {
            next();
            fs.unlink(path, () => {}); // for delete (?)
        })
        .catch(function (err) {
            console.log("Error @upload to S3:", err.message);
            res.sendStatus(500);
        });
};

module.exports.delete = (req, res, next) => {
    // console.log("s3:", req.params);
    const delId = req.params.fileInfo.slice(0, 2);
    const delFile = req.params.fileInfo.slice(3);
    console.log("Want to delete file (s3):" + delFile + " with id:" + delId);

    // s3.deleteObject({
    //     Bucket: "travel-board",
    //     Key: delFile,
    // })
    //     .promise()
    //     .then(function () {
    //         next();
    //     })
    //     .catch(function (err) {
    //         console.log("Error @delete to S3:", err.message);
    //         res.sendStatus(500);
    //     });
};
