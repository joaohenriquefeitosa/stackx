import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

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
export const handler = async (event) => {
    
    const httpMethod = event.requestContext.http.method;
    
    let response = [];
    let body;
    let itemId;
    try {
        switch (httpMethod) {
            case 'POST':
                body = JSON.parse(event.body);
                response = await create(body);
                break;
            case 'GET':
                body = JSON.parse(event.body);
                console.log('Body:', body);
            
                itemId = body?.itemId; // Use optional chaining to safely access itemId
                console.log('Item ID:', itemId);
            
                if (itemId !== undefined) {
                    response = await get(itemId);
                } else {
                    response = await index();
                }
                break;
            case 'PUT':
                body = JSON.parse(event.body);
                response = await update(body);
                break;
            case 'DELETE':
                body = JSON.parse(event.body);
                itemId = body?.itemId;
                response = await destroy(itemId);
                break;        
            default:
                throw new Error(`Unsupported method "${httpMethod}"`);
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