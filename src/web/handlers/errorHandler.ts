import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { MainError } from "../../errors";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // 🔎 Log interno del servidor
  request.log.error(error);

  if (error instanceof MainError) {
    const { name, ...errorData } = {
      statusCode: error.status,
      name: error.name,
      type: error.type,
      message: error.message,
      data: error.originalError,
      details: error.details ?? [],
    };

    console.log("Error Handler: ", { name, ...errorData });
    return reply.code(error.status).send(errorData);
  }

  // ⚠️ Error inesperado
  return reply.status(500).send({
    status: 500,
    type: "UnexpectedError",
    message: "(SI OCURRE ESTE ERROR HACER PRUEBAS)",
  });
}
