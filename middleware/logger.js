const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.hostname}:${process.env.PORT || 3000}${req.url}`);
    next();
}

export default logger;
