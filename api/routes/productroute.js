import multer from 'multer';
import path from 'path';
import express from 'express';
const router = express.Router();
import { addProduct, getAllProducts, rateProduct, removeit } from '../controllers/productscontroller.js';


const storage = multer.diskStorage({
    destination: 'uploads',

    filename:  (req, file, cb)=> {
    return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });



router.post('/add', upload.single('image'), addProduct);
router.put('/rate/:productId', rateProduct);
router.get('/list', getAllProducts);
router.post('/remove', removeit);

export default router;
