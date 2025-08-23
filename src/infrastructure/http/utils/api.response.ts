class ApiResponse {
  static success<T>(statusCode: number, message: string, data: T) {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static error<T>(statusCode: number, message: string, data: T) {
    return {
      success: false,
      statusCode,
      message,
      data,
    };
  }
}

export default ApiResponse;
