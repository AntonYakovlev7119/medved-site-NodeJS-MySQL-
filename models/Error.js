class ApiError extends Error {
  status;

  constructor(status, message, errors) {
    super(message);
    this.status = status;
  }

  static badRequest(message) {
    return new ApiError(404, message);
  }

  static loginError(message) {
    return new ApiError(400, message);
  }

  static internalError(message) {
    console.log(this.errors);

    return new ApiError(500, message);
  }

  // static customError(status, message) {
  //   return new ApiError(status, message);
  // }
}

module.exports = ApiError;
