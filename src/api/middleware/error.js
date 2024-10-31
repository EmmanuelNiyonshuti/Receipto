
import express from 'express';
import multer from 'multer';

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
            const error = new Error('Invalid JSON');
            error.status = 400;
            throw error;
        }
    }
});

export const multerError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'MULTER_ERROR',
                message: error.message,
                field: error.field
            }
        });
    }
    next(error);
};
