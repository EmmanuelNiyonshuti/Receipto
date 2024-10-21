/**
 * @desc Receipts management controllers.
 * @route POST /api/receipts
 */
export class ReceiptsController{
    static createReceipt(req, res) {
        const user = req.user;
        if (!req.files || req.files.length == 0)
            return res.status(400).json({ error: 'No file uploaded'});
        const file = req.files[0];
        return res.status(200).json({ username: user.username,
                                      filename: file.filename });
    }
}
