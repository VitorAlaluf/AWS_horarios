const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  let requestJSON = JSON.parse(event.body);
  
  try {
    switch (event.routeKey) {
      case "GET /horarios":
        body = await dynamo.scan({ TableName: "horario-atendimento-lista" }).promise();
        break;

      case "GET /horarios/{id}":
        body = await dynamo
          .get({
            TableName: "horario-atendimento-lista",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        break;
      case "DELETE /horarios/{id}":
        await dynamo
          .delete({
            TableName: "horario-atendimento-lista",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;

      case "POST /horarios":
        await dynamo
          .put({
            TableName: "horario-atendimento-lista",
            Item: {
              id: requestJSON.id,
              inicio_semana: requestJSON.inicio_semana,
              fim_semana: requestJSON.fim_semana,
              inicio_sabado: requestJSON.inicio_sabado,
              fim_sabado: requestJSON.fim_sabado,
              inicio_domingo: requestJSON.inicio_domingo,
              fim_domingo: requestJSON.fim_domingo,
              inicio_feriado: requestJSON.inicio_feriado,
              fim_feriado: requestJSON.fim_feriado
            }
          })
          .promise();
        body = `Post item ${requestJSON.id}`;
        break;

      case "PATCH /horarios":
      await dynamo
      .delete({
        TableName: "horario-atendimento-lista",
        Key: {
          id: requestJSON.id
        }
      })
      .promise();
      await dynamo
      .put({
        TableName: "horario-atendimento-lista",
        Item: {
          id: requestJSON.id,
          inicio_semana: requestJSON.inicio_semana,
          fim_semana: requestJSON.fim_semana,
          inicio_sabado: requestJSON.inicio_sabado,
          fim_sabado: requestJSON.fim_sabado,
          inicio_domingo: requestJSON.inicio_domingo,
          fim_domingo: requestJSON.fim_domingo,
          inicio_feriado: requestJSON.inicio_feriado,
          fim_feriado: requestJSON.fim_feriado
        }
      })
      .promise();
      body = `Patch item ${requestJSON.id}`;
      break;

    default:
      throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
