const express = require("express");
const multer = require("multer");
const activityRoute = express.Router();

const { UploadExel, postData, GetActivity } = require('../controllers/ActivityController');

const memory = multer.memoryStorage()
const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, './src/assets/files/')
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now()+ '_' + file.originalname) //'Rambesment'
    }
})
const upload = multer({storage: storage})

activityRoute.get('/list/:id_ticket', GetActivity)
activityRoute.post('/file', upload.single('file'),UploadExel)
activityRoute.post('/file/post/:activityId',postData)

activityRoute.get("/test", (req, res) => {
    res.send("This is work :)");
  });
module.exports = activityRoute;

