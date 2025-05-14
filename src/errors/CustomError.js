export class CustomError extends Error {
    constructor(statusCode, message, errorCode) {
      super(message);
      this.statusCode = statusCode;
      this.errorCode = errorCode;
    }
}
  
export class BadRequestError extends CustomError {
    constructor(message = '잘못된 요청입니다') {
      super(400, message, 'BAD_REQUEST');
    }
}
  
export class NotFoundError extends CustomError {
    constructor(message = '리소스를 찾을 수 없습니다') {
      super(404, message, 'NOT_FOUND');
    }
}
  
export class ConflictError extends CustomError {
    constructor(message = '이미 존재합니다') {
      super(409, message, 'CONFLICT');
    }
}