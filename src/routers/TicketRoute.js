const express = require("express");
const ticketRoute = express.Router();

const {
  MyTickets,
  AddTicket,
  GetSummary,
  GetPendingTicket,
  ApprovalTicket,
  ProduceControl,
  DetailTicket,
  GetPendingProjectTicket,
} = require("../controllers/TicketController");

ticketRoute.get("/myticket/:ticket", MyTickets);
ticketRoute.get("/list/:approve", GetPendingTicket);
ticketRoute.get("/list/project/:approve",GetPendingProjectTicket)
ticketRoute.post("/produce",ProduceControl);
ticketRoute.get("/detail/:id_ticket", DetailTicket)
ticketRoute.put("/status", ApprovalTicket);
ticketRoute.post("/add", AddTicket);
ticketRoute.get("/summary/:email", GetSummary);

ticketRoute.get("/test", (req, res) => {
  res.send("This is work :)");
});
module.exports = ticketRoute;
