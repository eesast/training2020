const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();
const upload = multer({
    dest: path.join(__dirname, 'upload')
});

app.get("/", (req, res) => {
    console.dir("GET /");
    res.status(200).send("Hello Docker Network");
});

app.post('/upload', upload.single('file'), (req, res) => {
    console.dir(req.file);
    console.dir(req.body);
    res.end('success');
});

app.listen(40000, () => {
    console.log("Run On 40000");
});