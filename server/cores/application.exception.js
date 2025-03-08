export class ApplicationException extends Error {
  constructor(statusCode = 500, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class NotFoundException extends ApplicationException {
  constructor(message) {
    super(404, message);
  }
}

export class UnauthorizedException extends ApplicationException {
  constructor(message) {
    super(401, message);
  }
}

export class BadRequestException extends ApplicationException {
  constructor(message) {
    super(400, message);
  }
}
