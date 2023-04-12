var nodemailer = require("nodemailer");
const ejs = require('ejs');
const CONFIG = require("../config/data.config");

var mailService = async (to, sub, html) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: CONFIG.email, // Your email id
        pass: CONFIG.password, // Your password
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    let mailOption = {
      from: CONFIG.email, // Your Mail
      to: to,
      subject: sub,
      html: html,
    };
    transporter.sendMail(mailOption, async (err, info) => {
      if (err) {
        return console.log(err);
      }
      console.log("Message sent:%s", info.accepted);
      console.log("Preview URL:%s", nodemailer.getTestMessageUrl(info));
    });
  } catch (error) {
    console.error(error);
  }
};



const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: CONFIG.email,
    pass: CONFIG.password
  }
});

const sendEmail = (receiver, subject, content, filePath) => {

  ejs.renderFile(filePath, { content }, (err, data) => {
    if (err) {
      console.log(err);
    } else {

      var mailOptions = {
        from: CONFIG.email,
        to: receiver,
        subject: subject,
        html: data
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.accepted);
        console.log("Preview URL:%s", nodemailer.getTestMessageUrl(info));
      });
    }
  });
};

module.exports = {
  mailService,
  sendEmail
};