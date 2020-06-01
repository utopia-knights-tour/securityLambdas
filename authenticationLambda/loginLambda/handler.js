const jwt = require('jsonwebtoken'),
    bcrypt  = require('bcrypt'),
    knex = require('./config/db');

const failureResponse = {
    statusCode: 401,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    },
    body: "Failed to authenticate."
};
    
module.exports.handler = async (event, context) => {
    const { email, password } = JSON.parse(event.body);
    // Check credentials against the DB.
    const user = await knex('User').where('email', email).first();
    if (user == undefined) {
        return failureResponse;
    }
    const result = await bcrypt.compare(password, user.password);
    // Passwords do not match.
    if (!result) {
        return failureResponse;
    }
    // Issue JWT token to client.
    const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRATION_TIME});

    delete user.password;
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        body: JSON.stringify({
          token,
          user
        })
    };

};