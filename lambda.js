const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tableName = 'Items';

// Create new item
const create = async (data) => {
    const params = {
        TableName: tableName,
        Item: data,
    };
    await dynamoDb.put(params).promise();
    return data;
};

// Return a specific item
const get = async (itemId) => {
    const params = {
        TableName: tableName,
        Key: { itemId },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item;
};

// Return all items
const index = async () => {
    const params = {
        TableName: tableName,
    };
    const result = await dynamoDb.scan(params).promise();
    return result.Items;
};

// Update a specific item
const update = async (data) => {
    const params = {
        TableName: tableName,
        Key: { itemId: data.itemId },
        UpdateExpression: 'set info = :info',
        ExpressionAttributeValues: {
            ':info': data.info,
        },
        ReturnValues: 'UPDATED_NEW',
    };
    await dynamoDb.update(params).promise();
    return data;
};

// Delete a specific item
const destroy = async (itemId) => {
    const params = {
        TableName: tableName,
        Key: { itemId },
    };
    await dynamoDb.delete(params).promise();
    return { itemId };
};


// Handle the method requested and the properly response
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
                response = await destroy(itemId);
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