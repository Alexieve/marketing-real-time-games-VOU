import express, { Request, Response, NextFunction } from 'express';
import { Voucher } from '../models/VoucherModel';
import { voucherValidator } from '../utils/voucherValidators';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { publishToExchanges } from '../utils/publisher';
import axios from 'axios';
import multer, { FileFilterCallback } from 'multer';
import crypto from 'crypto';
import FormData from 'form-data'; // Ensure you import FormData from 'form-data'

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,

  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

const generateImageHashFromBuffer = (buffer: Buffer): string => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

router.put('/api/vouchers/update/:id', upload.single('imageUrl'), voucherValidator, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { code, qrCodeUrl, price, description, quantity, expTime, status, brand } = req.body;
    const imageFile = req.file;
    const fileType = imageFile?.mimetype;

    if (!imageFile) {
      throw new BadRequestError('No image uploaded');
    }

    const newImageHash = generateImageHashFromBuffer(imageFile.buffer) + '.' + fileType?.split('/')[1];

    const voucher = await Voucher.findById(id);

    if (!voucher) {
      throw new BadRequestError('Voucher not found');
    }

    // Take out the ole image hash
    const oldImageHash = voucher.imageUrl;

    // Update the voucher
    const updateData = {
      code,
      qrCodeUrl,
      imageUrl: newImageHash,
      price,
      description,
      quantity,
      expTime,
      status,
      brand,
    };

    voucher.set(updateData);
    const updatedVoucher = await voucher.save();

    const oldImageName = voucher._id + oldImageHash;
    const newImageName = voucher._id + newImageHash;

    // Compare the old and new image hashes
    if (oldImageHash !== newImageHash) {
      // Send the image to the image service
      const formData = new FormData();
      formData.append('imageUrl', imageFile.buffer, {
        filename: newImageName,
        contentType: imageFile.mimetype,
      });
      formData.append('oldImageName', oldImageName);

      const uploadImage = await axios.post('http://image-srv:3000/api/image/uploading', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadImage.status !== 201) {
        throw new BadRequestError('Image upload failed');
      }
    }

    // Publish the updated voucher to the exchanges
    updatedVoucher.imageUrl = `/api/image/fetching/${newImageName}`;
    await publishToExchanges('voucher_updated', JSON.stringify(updatedVoucher.toJSON()));

    console.log('Voucher updated successfully');
    res.status(200).send(updatedVoucher);

  } catch (error) {
    console.log(error);
    next(error); // Pass the error to the error-handling middleware
  }
});

export = router;
