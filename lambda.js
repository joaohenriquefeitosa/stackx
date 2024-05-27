const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tableName = 'Items';

// Handle the method reqeusted and the properly response
const handler = async (event) => {
    const httpMethod = event.httpMethod;

    const body = JSON.parse(event.body);
    const itemId = body?.itemId;
    let response = [];

    try {
        switch (key) {
            case 'POST':
                response = await create(body);
                break;
            case 'GET':
                if (itemId !== undefined) {
                    response = await index();
                } else {
                    response = await get(itemId);
                }
                break;
            case 'PUT':
                response = await update(body);
                break;
            case 'DELETE':
                response = await delete(itemId);
                break;        
            default:
                throw new Error(`Unsupported method "${method}"`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
}

exports = {
    handler
}