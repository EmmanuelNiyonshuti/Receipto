// receipts storage configuration middleware

import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
