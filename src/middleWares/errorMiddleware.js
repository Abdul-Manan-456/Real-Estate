const notFound = (req, res, next) => {
    const error = new Error(`not found ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const errorHandler = (err, req, res, next) => {

    const statuscode = res.statusCode === 200 ? 500 : res.statusCode;
    const stack = process.env.NODE_ENV !== 'production' ? err.stack : {}

    res.status(statuscode).send({
        success: false,
        status: statuscode,
        message: err?.message,
        stack: err?.stack
    })
    next();
}

module.exports = { notFound, errorHandler };