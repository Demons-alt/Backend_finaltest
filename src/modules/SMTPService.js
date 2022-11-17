const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");
const { db } = require("./MySQLConnection");

const readHtml = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

const sendMailfromHtml = function (args, callback) {
  readHtml(
    path.join(__dirname, "../assets/templates/EmailTemplate.html"),
    function (err, html) {
      const SqlQuery = `SELECT * FROM ticket_list_activity WHERE ticket_id = '${args.id_ticket}'`;
      db.query(SqlQuery, function (err, rows, fields) {
        if (err) throw err;
        const DataArray = rows;
        const template = handlebars.compile(html);
        const SmtpConfig = {
          pool: false,
          host: "smtp.gmail.com",
          port: "587",
          secure: false,
          requireTLS: true,
          auth: {
            user: "fahm3411@gmail.com",
            pass: "xwqaznyorulbsecf",
          },
          logger: true,
          debug: true,
        };
        const transporter = nodemailer.createTransport(SmtpConfig);
        const replacements = {
          DataArray,
        };
        const sendHtml = template(replacements);
        const mailOption = {
          from: args.from || '"Fred Foo 👻" <fahm3411@gmail.com>',
          to: args.email,
          subject: args.subject,
          html: sendHtml,
          // attachments
        };

        transporter.sendMail(mailOption, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Message sent: %s", info.response);
            return;
          }
          return callback(error);
        });
      });
    }
  );
};

module.exports = {
  sendMailfromHtml,
};
