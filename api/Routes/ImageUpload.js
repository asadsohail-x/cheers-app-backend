const express = require('express');
const route = express.Router();
const multer = require('multer')
/***************Routes************/

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, 'image-' + Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage })

route.post('/image', upload.single('image'), async (req, res) => {

    const file = req.file;
    console.log("===>", req.file)
    if (!file) {
        const error = new Error('Please upload a file')
        console.log('no-file')
        return next(error)
    }
    res.json({ Status: 'Image Uploaded', Imagename: req.file.filename, Imagepath: "/upload/" + req.file.filename });
});



module.exports = route;