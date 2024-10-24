
import express from 'express';

export const errorHandler = (error, req, res, next) => {
    if (error.status){
        res.status(error.status).json({ error: error.message });
    }else{
        res.status(500).json({ error: error.message });
    }
    next();
}

export const JsonErrorHandler = express.json({
    verify: (req, res, buf, encoding) => {
        try{
            JSON.parse(buf);
        }catch(e){
            e.status = 400;
            throw Error('Invalid JSON');
        }
    }
});
