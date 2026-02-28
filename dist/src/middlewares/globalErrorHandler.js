"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, req, res, next) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errorDetails = err;
    res.status(statusCode);
    res.json({
        message: errorMessage,
        error: errorDetails
    });
}
exports.default = errorHandler;
//# sourceMappingURL=globalErrorHandler.js.map