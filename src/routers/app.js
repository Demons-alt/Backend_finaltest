const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { get } = require("lodash");

const { consumeQueue } = require("../modules/RabbitMQConnection")
const SMTPServices = require('../modules/SMTPService');
const User = require("./UsersRoutes");
const Ticket = require("./TicketRoute");
const Activity = require("./ActivityRoute");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
};

consumeQueue("WaitTicket", async (ch, msg) => {
  try {
    console.log("Successfuly retrieve queue");
    const message = JSON.parse(msg.content.toString());
    const messageRabbitMq = get(message, "params.message");

    const sendmail = {
      email: messageRabbitMq.email,
      subject: messageRabbitMq.subject,
      id_ticket : messageRabbitMq.id_ticket
    };
    SMTPServices.sendMailfromHtml(sendmail, (err, result) => {
      if (err) {
        console.log(err);
      }
    });

    console.log("Email retrieved : ", messageRabbitMq.email +" with id " + messageRabbitMq.id_ticket);
    console.log("Subject retrieved : ", messageRabbitMq.subject);
    ch.ack(msg);
  } catch (error) {
    console.log(error);
    ch.ack(msg);
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/activity", Activity);
app.use("/ticket", Ticket);
app.use("/user", User);
app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
