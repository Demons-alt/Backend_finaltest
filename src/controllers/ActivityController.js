const { db } = require("../modules/MySQLConnection");
const response = require("../assets/helpers/BaseResponse");
const Jawt = require("jsonwebtoken");
const {produceQueue} = require('../modules/RabbitMQConnection');
const RedisService = require("../modules/RedisConnection");
const xlstojson = require("xlsx-to-json-lc");
const { v1, V3, v4 } = require("uuid");
const uuid4 = v4();

const GetActivity = (req, res) => {
  const Id = req.params.id_ticket;
  const sqlQuery = "SELECT * FROM ticket_list_activity WHERE ticket_id = ? ";
  db.query(sqlQuery,[Id], (err, result) => {
    if (err) {
      response.Failed(res, err, "FLD30");
    }

    response.Success(res, result, "ASKN30");
  });;
};

const UploadExel = (req, res) => {
  xlstojson(
    {
      input: req.file.path,
      output: null,
      lowerCaseHeaders: true,
    },
    async function (err, result) {
      const uuid = v1();
      if (err) {
        console.log(err);
      }
      const finalResult = result
        .filter(
          (item) =>
            item.activity_date != "" ||
            item.total_claim != "" ||
            item.description != ""
        )
        .map((item) => {
          return {
            id_ticket: uuid,
            activity_date: item.activity_date,
            total_claim: item.total_claim,
            description: item.description,
          };
        });
      const dat = {
        id: uuid,
      };
      try {
        console.log("store data in redis");
        await RedisService.setEx(uuid, 6000, JSON.stringify(finalResult));
        res.send(JSON.parse(await RedisService.get(uuid)));
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  );
};

const postData = async (req, res) => {
  const Id = req.params.activityId;
  const redisdata = await RedisService.get(Id);
  const data = JSON.parse(redisdata);
  
 for (const item of data) {
    try {
      console.log(item);
      db.query(
        `INSERT INTO ticket_list_activity ( ticket_id, description, activity_date, total_claim) VALUE (?,?,?,?)`,
        [
          item.id_ticket,
          item.description,
          item.activity_date,
          item.total_claim,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          res.end("Succes add data");
          return;
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

};

module.exports = {
  GetActivity,
  UploadExel,
  postData,
};
