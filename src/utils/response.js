export const success = (data, message = '성공') => {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
};

  
export const error = (code, message, statusCode) => {
    return {
      success: false,
      error: {
        code,
        message,
        statusCode,
        timestamp: new Date().toISOString()
      }
    };
};