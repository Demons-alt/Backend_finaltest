const { db } = require("../modules/MySQLConnection");
const response = require("../assets/helpers/BaseResponse");
const Jawt = require("jsonwebtoken");
const { V3, v4 } = require("uuid");
const uuid4 = v4();

//Register User
const Register = (req, res) => {
  const { email, password, nik, address, phone, role, project_name } = req.body;
  const id = uuid4;
  const sqlQuery = `INSERT INTO user (id_user,email, password, nik, address, phone_number, role, project_name) VALUE (?,?,?,?,?,?,?,?)`;

  // console.log(email + project_name + role);
  db.query(
    sqlQuery,
    [id, email, password, nik, address, phone, role, project_name],
    (err, result) => {
      const object = {
        message: "success add user",
      };
      if (err) {
        console.log(err);
        response.Failed(res, err, "FILD10");
      }
      res.end("Succes add data");
      return;
    }
  );
};

//Login
const Login = (req, res) => {
  const { email, password } = req.body;
  const sqlQuery = `SELECT * FROM user where email = ? && password = ? `;
  db.query(sqlQuery, [email, password], (err, result) => {
    try {
      if (result == 0) {
        response.Success(res, "user not found", "ASKN20");
      }
      console.log(result);
      Jawt.sign({ result }, "secret", { expiresIn: "36000s" }, (err, token) => {
        if (err) {
          console.log(err);
          return;
        }
        const Token = token;
        res.json({
          result,
          Token: Token,
        });
      });
    } catch (err) {
      response.Failed(res, err);
    }
  });
};

const ListUser = (req, res) => {
  const project= req.params.project;
  const sqlQuery = `SELECT * FROM user WHERE project_name = '${project}'`;      
  db.query(sqlQuery, (err, result) => {
    try {
      if (result == 0) {
        response.Success(res, "Noting User in your project", "ASKN20");
      }
      const object = {
        data: result,
      };
      if (err) {
          // console.log(err);
        response.Failed(res, err, "FLD20");
      }
      response.Success(res, object, "ASKN20");
    } catch (err) {
      console.log(err);
    }
  });
};

const AllUser = (req, res) => {
  const sqlQuery = `SELECT * FROM user `;      
  db.query(sqlQuery, (err, result) => {
    try {
      if (result == 0) {
        response.Success(res, "Noting User", "ASKN20");
      }
      const object = {
        data: result,
      };
      if (err) {
          // console.log(err);
        response.Failed(res, err, "FLD20");
      }
      response.Success(res, object, "ASKN20");
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = {
  Register,
  Login,
  ListUser,
  AllUser
};
