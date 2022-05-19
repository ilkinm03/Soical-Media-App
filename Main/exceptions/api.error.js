module.exports = class ApiError extends Error {
  status;
  errors;
  message;

  constructor(status, message, errors) {
    super(message);
    this.errors = errors;
    this.status = status;
    this.message = message;
  }
  static UnauthorizedError(message = "İstifadəçi sistemə daxil olmamışdır") {
    return new ApiError(401, message);
  }

  static BadRequest(message = "Bad Request") {
    return new ApiError(400, message);
  }

  static ConflictException(message = "Already exist") {
    return new ApiError(409, message);
  }

  static ForbiddenException(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static GeneralException(message = "Internal server error") {
    return new ApiError(500, message);
  }

  static ServiceUnavailableException(message = "Service Unavailable") {
    return new ApiError(503, message);
  }

  static NotFoundException(message = "Not found") {
    return new ApiError(404, message);
  }

  static ValidationError(message, errors) {
    return new ApiError(400, message, errors);
  }
};
