const User = require("../model/user");

const UserDAO = {
    async UserCreate(param) {
        const user = await User.create({
            first_name: param.first_name,
            last_name: param.last_name,
            email: param.email.toLowerCase(), // sanitize: convert email to lowercase
            password: param.password,
        });
        return user;
    },
    async FindUser(email) {
        const user = await User.findOne({ email });
        return user;
    }

}
module.exports = UserDAO;