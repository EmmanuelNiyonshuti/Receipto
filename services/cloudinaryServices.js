import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

export const uploadReceiptToCloudinary = async (buffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'Receipts'}, (error, result) => {
            if (error){
                reject(error);
            }else{
                resolve(result);
            }
        }).end(buffer);
    });
};
