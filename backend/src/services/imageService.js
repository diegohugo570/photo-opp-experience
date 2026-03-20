const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '../../public/photos');

// Ensure directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a generic frame placeholder using SVG
const createFrameSvg = (width, height) => {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="none" stroke="white" stroke-width="40"/>
      <rect y="${height - 200}" width="100%" height="200" fill="white" />
      <text x="${width/2}" y="${height - 100}" font-family="Arial" font-size="60" fill="black" text-anchor="middle" font-weight="bold">
        NEX.lab
      </text>
      <text x="${width/2}" y="${height - 40}" font-family="Arial" font-size="30" fill="black" text-anchor="middle">
        we make tech simple_
      </text>
    </svg>
  `;
};

const processImage = async (buffer) => {
  try {
    const filename = `photo_${Date.now()}.png`;
    const outputPath = path.join(publicDir, filename);

    // Assuming frontend already cropped to 9:16, but we enforce 1080x1920
    const targetWidth = 1080;
    const targetHeight = 1920;

    const frameSvgBuffer = Buffer.from(createFrameSvg(targetWidth, targetHeight));

    await sharp(buffer)
      .resize(targetWidth, targetHeight, { fit: 'cover' })
      .composite([{ input: frameSvgBuffer, blend: 'over' }])
      .toFile(outputPath);

    return filename; // Return relative filename
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
};

module.exports = { processImage };
