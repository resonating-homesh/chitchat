const jwt = require('jsonwebtoken');

//we are generating token using the id and JWT_SECRET
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

module.exports = generateToken;