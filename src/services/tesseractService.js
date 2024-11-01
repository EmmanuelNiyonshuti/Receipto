/**
 * @desc extracts texts from an image.
 */
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';


const fieldPatterns = {
    tin: /TIN:?\s*([0-9]{9})/i,
    period: /Period:?\s*([A-Za-z0-9\s/-]+)/i,
    poc: /POC:?\s*([0-9]+)/i,
    billType: /(Water|Electricity|Gas)\s*bill/i,
    name: /Name:?\s*([A-Za-z\s]+)/i,
    amount: /Amount:?\s*\$?\s*([0-9]+\.?[0-9]*)/i
}

const extractMetadata = (text) => {
    const extractedData = {
        tin: null,
        period: null,
        poc: null,
        billtype: null,
        name: null,
        amount: null
    };
    for (const [key, pattern] of Object.entries(fieldPatterns)){
        const match = text.match(pattern);
        if (match && match[1]){
            extractedData[key] = match[1].trim();
        }
    }
    return extractedData;
}

const preprocessImage = async imageBuffer => {
    // process image buffer to enhance OCR performance
    try{
        const processed = await sharp(imageBuffer)
             .resize({ width: 1200 })
             .grayscale()
             .normalize()
             .sharpen()
             .threshold(128)
             .gamma(1.5)
             .median(1)
             .toBuffer();
        return processed;
    }catch(error){
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
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz%$.,-: ',
            tessedit_ocr_engine_mode: '1',
            preserve_interword_spaces: '1',
        });
        const { data: { text } } = await worker.recognize(processedBuffer);
        await worker.terminate();
        const data = extractMetadata(text);
        return data; 
    }catch(error){
        console.error('Error during ocr processing', error);
        throw error;
    }
}
