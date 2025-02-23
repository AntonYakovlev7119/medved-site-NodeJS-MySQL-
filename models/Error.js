class ApiError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static badRequest(message) {
    return new ApiError(404, message);
  }

  static loginError(message) {
    return new ApiError(400, message);
  }

  static internalError(message) {
    return new ApiError(500, message);
  }

  // static customError(status, message) {
  //   return new ApiError(status, message);
  // }
}

module.exports = ApiError;
