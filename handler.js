'use strict';

const name = 'tenant';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const Tenant = require('./tenant');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const headers = {
  "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
};

module.exports.create = async (event, context) => {
  const data = JSON.parse(event.body);
  const model = new Tenant(
      data.id,
      data.name,
      data.address,
      data.phone
  );
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: model
  };
  
  try {
    const result = await dynamodb.put(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(result.Item)
    };
  }
  catch (error) {
    console.error('error', error);
    return {
      statusCode: error.statusCode || 501,
      headers: headers,
      error: `Could not create ${name}`
    };
  }
};

module.exports.delete = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.requestContext.authorizer.claims["custom:tenant_id"]
    }
  };
  
  try {
    const result = await dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({}),
    };
  }
  catch (error) {
    console.error('error', error);
    return {
      statusCode: error.statusCode || 501,
      headers: headers,
      error: `Could not delete ${name}`
    };
  }
};

module.exports.single = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.requestContext.authorizer.claims["custom:tenant_id"]
    }
  };
  
  try {
    const result = await dynamodb.get(params).promise();
    
    // // if no items were found
    // if (!result || typeof result === 'undefined' || !result.Item) {
    //   console.log('not found');
    //   return {
    //     statusCode: 404,
    //     headers: headers,
    //     body: { message: `Couldn\'t find ${name}` }
    //   };
    // }
    
    return {
      statusCode: 200,  
      headers: headers,
      body: JSON.stringify(result.Item)
    };
  }
  catch (error) {
    console.error('error', error);
    return {
      statusCode: error.statusCode || 501,
      headers: headers,
      error: `Could not get ${name}`
    };
  }
};

module.exports.update = async (event, context) => {
  const data = JSON.parse(event.body);

  var expression = `SET #name = :name, address = :address, phone = :phone, 
    lastUpdated = :lastUpdated`;

  var expressionValues = {
    ':name': data.name,
    ':address': data.address,
    ':phone': data.phone,
    ':lastUpdated': new Date()
  };

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.requestContext.authorizer.claims["custom:tenant_id"]
    },
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    UpdateExpression: expression,
    ExpressionAttributeValues: expressionValues,
    ReturnValues: 'ALL_NEW'
  };
  
  try {
    const result = await dynamodb.update(params).promise();
    
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(result.Item)
    };
  }
  catch (error) {
    console.error('error', error);
    return {
      statusCode: error.statusCode || 501,
      headers: headers,
      error: 'Could not update tenant'
    };
  }
};
