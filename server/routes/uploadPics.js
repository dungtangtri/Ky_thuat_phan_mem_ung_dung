const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../db/connection').connection;
const sql = require('mssql');
const isAdmin = require('./admin').isAdmin;


router.post('/upload', isAdmin , (req, res) => {
    try {
        // Get the file that was set to our field named "image"
        const { image } = req.files;

        // If no image submitted, exit
        if (!image) return res.sendStatus(400);

        // If does not have image mime type prevent from uploading
        let imageBuffer = new Buffer.from(image.data);
        console.log(imageBuffer);
        const request = connection.request();
        request.input('imageBuffer', sql.VarBinary, imageBuffer);
        request.query('INSERT INTO plants_img (img) VALUES (CONVERT(varbinary(max), @imageBuffer))',
             (err, result) => {
                if (err) console.log(err);
                else {
                    res.redirect('/upload');
                    
                }

            });
    }
    catch (error) {
        console.log(error);
    }

});

router.get('/upload', isAdmin , (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/upload.html'));
});

module.exports = router;