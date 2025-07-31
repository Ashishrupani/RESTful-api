export const errorHandler = (statusCode = 500, message = "Something went wrong") => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
};