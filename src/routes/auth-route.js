const express = require('express');
const route = express.Router();
const constant = require('../config/constant');
const AuthService = require("../services/auth-services");

route.post("/login", (req, res) => {
    AuthService.login(req).then((result) => {
        res.status(constant.HTML_STATUS_CODE.SUCCESS).json(result);
    }).catch((error) => {
        res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    });
})

route.post("/register", (req, res) => {
    AuthService.register(req).then((result) => {
        res.status(constant.HTML_STATUS_CODE.SUCCESS).json(result);
    }).catch((error) => {
        res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    });
})

route.get("/welcome", AuthService.verifyToken, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

module.exports = route;