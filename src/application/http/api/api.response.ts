class ApiResponse {
  static success<T>(statusCode: number, message: string, data: T) {
    return {
      statusCode,
      message,
      data,
    };
  }

  static error<T>(statusCode: number, errorMessage: string, data: T) {
    return {
      statusCode,
      errorMessage,
      data,
    };
  }
}
