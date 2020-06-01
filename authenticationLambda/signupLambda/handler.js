const bcrypt = require('bcrypt')
   const knex = require('./config/db');

module.exports.handler = async (event, context) => {
    const { 
        email,
        password, 
        role, 
        agencyId, 
        customerAddress,
        customerName,
        customerPhone
    } = JSON.parse(event.body);
   
    const hash = await bcrypt.hash(password, 10);
    let user = { 
        email,
        role,
        agencyId,
        password: hash
    };
    await knex.transaction(async (trx) => {
        try {
            const id = await knex.insert(user).into('User').transacting(trx);
            if (role === "customer") {
                let customer = { 
                    customerAddress,
                    customerName,
                    customerPhone,
                    userId: id
                };
                await knex.insert(customer).into('Customer').transacting(trx);
            }
    
        } catch(err) {
            return {
                statusCode:401,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization"
                },
                message: "Failed to authenticate."
            };
        }

    });

    return {
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    };
};