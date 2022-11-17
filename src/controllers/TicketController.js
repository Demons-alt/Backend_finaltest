const { db } = require("../modules/MySQLConnection");
const response = require("../assets/helpers/BaseResponse");
const {produceQueue} = require('../modules/RabbitMQConnection');

//get tickets
const MyTickets = (req, res) => {
  const ticket = req.params.ticket;
  const sqlQuery = `SELECT * FROM ticket Where created_by = '${ticket}'`;

  db.query(sqlQuery, (err, result) => {
    const object = {
      data: result,
    };
    if (err) {
      console.log(err);
      response.Failed(res, err, "FLD20");
    }
    response.Success(res, result, "ASKN20");
  });
};
const ApprovalTicket = (req, res) => {
  const Update = req.body.update;
  const id = req.body.id_ticket;
  const sqlQuery = `UPDATE ticket SET status = '${Update}' WHERE ticket_id = '${id}'`;
  db.query(sqlQuery, (err, result) => {
    const object = {
      data: result,
    };
    if (err) {
      console.log(err);
      response.Failed(res, err, "FLD20");
    }
    response.Success(res, result, "ASKN20");
    console.log(result + sqlQuery);
    
  });
};
const ApprovalPM = (req, res) => {
  const Update = req.body.update;
  const id = req.body.id_ticket;
  const sqlQuery = `UPDATE ticket SET status = '${Update}' WHERE ticket_id = '${id}'`;
  db.query(sqlQuery, (err, result) => {
    const object = {
      data: result,
    };
    if (err) {
      console.log(err);
      response.Failed(res, err, "FLD20");
    }
    response.Success(res, result, "ASKN20");
    console.log(result + sqlQuery);
    
  });
};
const GetPendingTicket = (req, res) => {
  const approve = req.params.approve;
  const sqlQuery = `SELECT * FROM ticket WHERE current_approval_name = "${approve}" && created_by IN(SELECT email FROM user WHERE role = "Project Manager" && status = 'pending' || role = "Developer" && status = 'pending')`;

  db.query(sqlQuery, (err, result) => {
    const object = {
      data: result,
    };
    if (err) {
      console.log(err);
      response.Failed(res, err, "FLD20");
    }

    response.Success(res, result, "ASKN20");
  });
};

const GetPendingProjectTicket = (req, res) => {
  const approve = req.params.approve;
  const sqlQuery = `SELECT * FROM ticket WHERE current_approval_name = "${approve}" && created_by IN(SELECT email FROM user WHERE role = "Developer" && status = 'pending')`;

  db.query(sqlQuery, (err, result) => {
    const object = {
      data: result,
    };
    if (err) {
      console.log(err);
      response.Failed(res, err, "FLD20");
    }

    response.Success(res, result, "ASKN20");
  });
};
const AddTicket = (req, res) => {
  const {
    ticket_id,
    ticket_type,
    created_by,
    current_approval_name,
    current_approval_role,
  } = req.body;
  const status = "pending";

  const sqlQuery = `INSERT INTO ticket (ticket_id,ticket_type, created_by, current_approval_name, current_approval_role,status) VALUE (?,?,?,?,?,?)`;

  db.query(
    sqlQuery,
    [
      ticket_id,
      ticket_type,
      created_by,
      current_approval_name,
      current_approval_role,
      status,
    ],
    (err, result) => {
      const object = {
        message: "Success Add Ticket",
      };
      if (err) {
        console.log(err);
        response.Failed(res, err, "FILD10");
      }
      response.Success(res, object, "ASKN10");
    }
  );
};

const GetSummary = (req, res) => {
  const email = req.params.email;
  const sqlQuery = `select COUNT(if(status='pending',1,NULL)) as pending, COUNT(if(status='reject',1,NULL)) as reject, COUNT(if(status='approve',1,NULL)) as approve from ticket WHERE created_by = '${email}'`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      // console.log(err);
      response.Failed(res, err, "FLD30");
    }

    response.Success(res, result, "ASKN30");
  });
};
const DetailTicket = (req, res) => {
  const id_ticket = req.params.id_ticket
  const sqlQuery1 = `SELECT * FROM ticket_list_activity WHERE ticket_id IN (SELECT ticket_id FROM ticket WHERE status = 'pending' && current_approval_name = 'fahm@gmail.com')`;
  const sqlQuery = `SELECT * FROM ticket WHERE ticket_id = "${id_ticket}"`
  db.query(sqlQuery, (err, result) => {
    if (err) {
      response.Failed(res, err, "FLD30");
    }

    response.Success(res, result, "ASKN30");
  });
};

const ProduceControl = async (req, res) => {
  const email = req.body.email;
  const id_ticket = req.body.id_ticket;
  try {
    produceQueue(
      { email: email, subject: "Approval ticket", id_ticket: id_ticket },
      "WaitTicket",
      (err) => {
        if (err) throw err;
        console.log("Success Produce Queue");
      }
    );
    return res.send("Success");
  } catch (error) {  
    console.log(error);
    res.send(error);
  }
};

module.exports = {
  GetPendingProjectTicket,
  ProduceControl,
  GetSummary,
  MyTickets,
  AddTicket,
  GetPendingTicket,
  ApprovalTicket,
  DetailTicket,
};
