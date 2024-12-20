class ResponseHandler {
  static success(res, data, status = 200) {
    return res.status(status).json({
      success: true,
      data
    });
  }

  static error(res, message, status = 500) {
    return res.status(status).json({
      success: false,
      error: message
    });
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static badRequest(res, message = 'Bad request') {
    return this.error(res, message, 400);
  }

  static created(res, data) {
    return this.success(res, data, 201);
  }
}

module.exports = ResponseHandler; 