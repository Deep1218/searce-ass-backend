/**
 * Please use below convensions to set error
 * 1001 - 1499 generic error
 * 1500 - 2000 user
 * 2001 - 2500 project
 * 2501 - 3000 position
 */
const message = {
  200: {
    message: "ok",
    httpCode: 200,
  },
  204: {
    message: "no content",
    httpCode: 204,
  },
  400: {
    message: "bad request",
    httpCode: 400,
  },
  401: {
    message: "unauthorized access",
    httpCode: 401,
  },
  403: {
    message: "Forbidden: Access is forbidden to the requested resources",
    httpCode: 403,
  },
  404: {
    message: "not found",
    httpCode: 404,
  },
  1001: {
    message: "Something went wrong on server",
    httpCode: 500,
  },
  1500: {
    message: "email is required",
    httpCode: 400,
  },
  1501: {
    message: "Invalid email",
    httpCode: 400,
  },
  1502: {
    message: "password is required",
    httpCode: 400,
  },
  1504: {
    message: "Invalid email or password",
    httpCode: 400,
  },
  1505: {
    message: "name is required",
    httpCode: 400,
  },
  1506: {
    message: "email is already exist",
    httpCode: 400,
  },
  1507: {
    message: "invalid user",
    httpCode: 400,
  },
  2001: {
    httpCode: 400,
    message: "project not found",
  },
};

module.exports = message;
