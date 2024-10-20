export const notFound = (req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    return next(error);
}
