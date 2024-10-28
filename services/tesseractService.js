/**
 * @desc extracts texts from an image.
 */
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';

const preprocessImage = async imageBuffer => {
    try{
        const processed = await sharp(imageBuffer)
             .resize({ width: 1200 })
             .grayscale()
             .normalize()
             .sharpen()
             .threshold(128)
             .toBuffer();
        return processed;
    }catch(error){
        console.error('Error preprocessing image:', error);
        throw error;
    }
}
export async function extractTextFromReceipt(imageBuffer) {
    try{
        const processedBuffer = await preprocessImage(imageBuffer);
        const worker = await createWorker({
            logger: (m) => {
                if (process.env.NODE_ENV === 'development'){
                    console.log(m)
                }
            }
        });
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        await worker.setParameters({
            tessedit_pageseg_mode: '3',
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz%$ ',
            tessedit_ocr_engine_mode: '1',
            preserve_interword_spaces: '1',
        });
        const { data: { text } } = await worker.recognize(processedBuffer);
        await worker.terminate();
        return text;
    }catch(error){
        console.error('Error during ocr processing', error);
        throw error;
    }
}
