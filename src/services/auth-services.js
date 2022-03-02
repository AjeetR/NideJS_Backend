const constant = require('../config/constant');
const User = require("../model/user");
const bcrypt = require("bcryptjs")
const UserDAO = require("../dao/user-dao");
const Common = require("../config/common");
const jwt = require("jsonwebtoken");

const AuthService = {
    async login(req) {
        try {
            const { email, password } = req.body;
            if (!(email && password))
                return "All input is required";

            const user = await UserDAO.FindUser(email)
            if (user && (await bcrypt.compare(password, user.password))) {
                // Create token
                const token = jwt.sign(
                    { email: user.email, first_name: user.first_name, last_name: user.last_name },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                // save user token
                user.token = token;

                // user
                return Promise.resolve({ status: constant.HTML_STATUS_CODE.SUCCESS, message: user });
            }
            return Promise.resolve({ status: constant.HTML_STATUS_CODE.INVALID_DATA, message: "Invalid Credentials" });
        }
        catch (err) {
            console.log(err);
            return { "status": 401, Error: err };
        }

    },

    async register(req) {
        try {
            // Get user input
            const { first_name, last_name, email, password } = req.body;

            // Validate user input
            if (!(email && password && first_name && last_name)) {
                return Promise.resolve({ status: constant.HTML_STATUS_CODE.INVALID_DATA, message: "All input is required" });
            }

            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await UserDAO.FindUser(email)

            if (oldUser) {
                return Promise.resolve({ status: constant.HTML_STATUS_CODE.CONFLICT, message: "User Already Exist. Please Login" });
            }

            //Encrypt user password
            encryptedPassword = await bcrypt.hash(password, 10);

            let userRequest = { first_name, last_name, email, password: encryptedPassword }
            // Create user in our database
            const user = await UserDAO.UserCreate(userRequest)
            user.token = await this.generateToken(user);
            return Promise.resolve({ status: constant.HTML_STATUS_CODE.SUCCESS, data: user });
        } catch (error) {
            return Promise.reject({ status: constant.HTML_STATUS_CODE.CONFLICT, message: error.message });
        }
    },


    async generateToken(user) {
        try {
            const token = jwt.sign(
                { email: user.email, first_name: user.first_name, last_name: user.last_name },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            return token;
        } catch (error) {
            return error;
        }
    },


    async verifyToken(req, res, next) {
        const token =
            req.body.token || req.query.token || req.headers["x-access-token"];

        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            req.user = decoded;
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
        return next();
    }
}


module.exports = AuthService;