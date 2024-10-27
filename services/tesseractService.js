/**
 * @desc extracts texts from an image.
 */
import { createWorker } from 'tesseract.js';

export async function extractTextFromReceipt(imageBuffer) {
    try{
        const worker = await createWorker({
            logger: (m) => console.log(m), 
        });
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(imageBuffer, {
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            preserve_interword_spaces: '1',
            tessedit_pagesegmode: 6
        });
        await worker.terminate();
        return text;
    }catch(error){
        console.error('Error during ocr processing', error);
        throw error;
    }
}
