import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directoryPath = 'public/Images/TRANSPARENT/PNG';

async function convertImages() {
  try {
    const files = fs.readdirSync(directoryPath);
    console.log(`Found ${files.length} files in ${directoryPath}`);

    for (const file of files) {
      if (file.endsWith('_transparent.png')) {
        const inputPath = path.join(directoryPath, file);
        const outputFileName = file.replace('.png', '.webp');
        const outputPath = path.join(directoryPath, outputFileName);

        console.log(`Optimizing and converting: ${file}...`);
        
        await sharp(inputPath)
          .resize({
            width: 1024,
            height: 1024,
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 85 })
          .toFile(outputPath);
          
        const oldSize = (fs.statSync(inputPath).size / 1024 / 1024).toFixed(2);
        const newSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
        console.log(`Successfully converted ${file} (${oldSize} MB) -> ${outputFileName} (${newSize} MB)`);
      }
    }
    console.log('All image optimization complete!');
  } catch (error) {
    console.error('Error during image conversion:', error);
  }
}

convertImages();
