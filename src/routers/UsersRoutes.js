const express = require("express");
const UserRoute = express.Router();

const {

     Register, 
    Login,
    ListUser,
    AllUser
    } = require("../controllers/UserController");

UserRoute.post('/register', Register)
UserRoute.post('/login', Login)
UserRoute.get('/list/:project', ListUser)
UserRoute.get('/all', AllUser)


UserRoute.get("/test", (req, res) => {
    res.send("This is work :)");
  });
module.exports = UserRoute;
