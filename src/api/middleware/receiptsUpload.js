/**
 * @desc receipts storage configuration middleware
 */
import multer from 'multer';

const storage = multer.memoryStorage();

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

const fileFilter = (req, file, cb) => {
    //controls which files are accepted.
    try{
        if (allowedFileTypes.includes(file.mimetype)){
            cb(null, true);
        }else{
            cb(null, false);
        }
    }catch(error){
        cb(new Error('Error uploading file', error.message));
    }
}
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
