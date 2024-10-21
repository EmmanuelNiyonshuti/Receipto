
export const errorHandler = (error, req, res, next) => {
    if (error.status){
        res.status(error.status).json({ error: error.message });
    }else{
        res.status(500).json({ error: error.message });
    }
    next();
}
