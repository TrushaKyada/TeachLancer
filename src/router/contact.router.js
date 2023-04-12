const router = require('express').Router();

const { 
    insertContact
} = require("../controller/contact.controller")

router.post("/insert", insertContact);

module.exports = router;