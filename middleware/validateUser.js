import { body } from 'express-validator';

const validateUser = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength( { min: 5} ),
    body('username').isLength( { min: 3} )
];

export default validateUser;
