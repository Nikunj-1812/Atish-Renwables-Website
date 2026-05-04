const fs = require('fs/promises');
const path = require('path');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const { sendError, sendSuccess } = require('../utils/apiResponse');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, {
        statusCode: 400,
        message: 'Image file is required.',
      });
    }

    if (!isCloudinaryConfigured()) {
      const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileExtension = req.file.mimetype.split('/')[1] || 'jpg';
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      await fs.writeFile(filePath, req.file.buffer);

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Image uploaded successfully.',
        data: {
          secureUrl: `/uploads/${fileName}`,
          publicId: fileName,
          width: null,
          height: null,
        },
      });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'atish-website',
      resource_type: 'image',
      quality: 'auto:good',
      fetch_format: 'auto',
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Image uploaded successfully.',
      data: {
        secureUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to upload image.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

module.exports = {
  uploadImage,
};