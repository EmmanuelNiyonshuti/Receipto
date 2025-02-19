/**
 * @desc extracts texts from an image.
 */
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';

const fieldPatterns = {
    name: /(?:BILL TO|Name|Customer|RECEIVED FROM|Sold To):?\s*([A-Za-z\s]+)/i,
    billType: /\b(Receipt|Invoice|Bill|Payment|Sales Receipt|Cash Receipt|RENT RECEIPT|Purchase)\b/i,
    date:  /(?:Date|DATE|Period|Time|Transaction Date):?\s*([\d]{2}[\/\.-][\d]{2}[\/\.-][\d]{2,4}(?:\s[\d]{1,2}:[\d]{2}\s*(?:AM|PM))?)/i,
    businessName: /([A-Za-z\s]+? (?:Grocers|Shop|Store|Market|Mart|Café|Restaurant|Slip|Parking|Garage|Center))/i,
    amount: /(?:TOTAL|Amount|AMT):?\s*[$₣RWF]*\s*([0-9,]+(?:\.[0-9]+)?)/i,
    paymentMethod: /(CREDIT CARD|DEBIT CARD|CASH|VISA|MASTERCARD)[\s]*(?:\(*[0-9]{4}\)*)?/i
}

const extractMetadata = (text) => {
    const extractedData = {
        name: null,
        billType: null,
        date: null,
        storeName: null,
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

// const preprocessImage = async imageBuffer => {
//     process image buffer to enhance OCR performance
//     try{
//         const processed = await sharp(imageBuffer)
//              .resize({ width: 1200 })
//              .grayscale()
//              .normalize()
//              .sharpen()
//              .threshold(128)
//              .gamma(1.5)
//              .median(1)
//              .toBuffer();
//         return processed;
//     }catch(error){
//         throw error;
//     }
// }
export async function extractTextFromReceipt(imageBuffer) {
    try{
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
            preserve_interword_spaces: '1'
        });
        const { data: { text } } = await worker.recognize(imageBuffer);
        await worker.terminate();
        const data = extractMetadata(text);
        return data; 
    }catch(error){
        console.error('Error during ocr processing', error);
        throw error;
    }
}
