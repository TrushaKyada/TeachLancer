const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require("path");
require('./db/conn');
const cors = require('cors');
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* ----- set public path ----- */
app.use(express.static(path.join(__dirname, "public")))

/* ----- Set EJS as templating engine ----- */
app.set('view engine', 'ejs');

/* ----- pages router ----- */
app.get('/',(req, res) => {
    res.render('hiredMail');
});

// ----- router ----- //
const companyRouter = require("./router/company.router");
const userRouter = require("./router/user.router.js");
const careerRouter = require("./router/career.router.js");
const adminRouter = require("./router/admin.router.js");
const commonRouter = require("./router/common.router.js");
const jodsRouter = require("./router/jobs.router.js")
const internshipRouter = require("./router/internship.router.js")
const teacherRouter = require("./router/teacher.router.js");
const coursesRouter = require("./router/courses.router.js");
const appliesRouter = require("./router/applies.router.js");
const hiredRouter = require("./router/hired.router.js");
const enrolledRouter = require("./router/enrolled.router")
const faqRouter = require("./router/faq.router.js");
const lectureRouter = require("./router/lecture.router.js");
const assignmentRouter = require("./router/assignment.router");
const videoRouter = require("./router/video.router");
const chatRouter = require("./router/chat.router");
const groupRouter = require("./router/group.router");
const contactRouter = require("./router/contact.router");
const paymentRouter = require("./router/transaction.router");

app.use("/company",companyRouter);
app.use("/user",userRouter);
app.use("/career",careerRouter);
app.use("/admin", adminRouter);
app.use("/common", commonRouter);
app.use("/jobs", jodsRouter);
app.use("/internship", internshipRouter);
app.use("/teacher", teacherRouter);
app.use("/courses", coursesRouter);
app.use("/applies", appliesRouter);
app.use("/hired", hiredRouter);
app.use("/enrolled", enrolledRouter);
app.use("/faq", faqRouter);
app.use("/lecture", lectureRouter);
app.use("/assignment", assignmentRouter);
app.use("/video", videoRouter);
app.use("/chat", chatRouter);
app.use("/group", groupRouter);
app.use("/contact", contactRouter);
app.use("/payment", paymentRouter)

module.exports = app;