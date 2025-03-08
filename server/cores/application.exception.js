class ApplicationException extends Error {
  constructor(statusCode = 500, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class NotFoundException extends ApplicationException {
  constructor(message) {
    super(404, message);
  }
}

class UnauthorizedException extends ApplicationException {
  constructor(message) {
    super(401, message);
  }
}

class BadRequestException extends ApplicationException {
  constructor(message) {
    super(400, message);
  }
}

module.exports = {
  ApplicationException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
};
