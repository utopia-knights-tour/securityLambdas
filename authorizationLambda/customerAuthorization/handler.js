const jwt = require('jsonwebtoken');

const generateIamPolicy = (principalId, effect, methodArn) => {
    const policyDocument = generatePolicyDocument(effect, methodArn);
    return {
        principalId,
        policyDocument
    };
};

const generatePolicyDocument = (effect, methodArn) => {
    const policyDocument = {
        Version: "2012-10-17",
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: methodArn
            }
        ] 
    };
    return policyDocument;
};

module.exports.handler = (event, context, callback) => {
    try {
        const token = event.authorizationToken;
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        const authorized = decodedUser.role === "customer";
        const effect = authorized? 'Allow' : 'Deny';
        const iamPolicy = generateIamPolicy(decodedUser.userId, effect, event.methodArn);
        callback(null, iamPolicy);

    } catch(err) {
        callback('Unauthorized');
    }
};