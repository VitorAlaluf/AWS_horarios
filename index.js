const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
      case "DELETE /horarios/{id}":
        await dynamo
          .delete({
            TableName: "horario-atendimento-teste",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;

      case "GET /horarios/{id}":
        body = await dynamo
          .get({
            TableName: "horario-atendimento-teste",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        break;

      case "GET /horarios":
        body = await dynamo.scan({ TableName: "horario-atendimento-teste" }).promise();
        break;

      case "post /horarios":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .post({
            TableName: "horario-atendimento-teste",
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
        body = `Put item ${requestJSON.id}`;
        break;

      case "PATCH /horarios":
      await dynamo
        .patch({
          TableName: "horario-atendimento-teste",
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
      body = `Put item ${requestJSON.id}`;
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
