import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const QUALITY = {
  jpeg: 80,
  png: 80,
  webp: 80
};

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

async function getAllImages(dir) {
  const images = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      images.push(...await getAllImages(fullPath));
    } else if (/\.(jpg|jpeg|png)$/i.test(item.name)) {
      images.push(fullPath);
    }
  }

  return images;
}

async function optimizeImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const relativePath = path.relative(IMAGES_DIR, imagePath);
  
  try {
    const stats = await fs.stat(imagePath);
    const originalSize = stats.size;
    
    // Skip if already optimized (less than 200KB)
    if (originalSize < 200 * 1024) {
      console.log(`⏭️  Skipping ${relativePath} (already optimized: ${(originalSize / 1024).toFixed(2)}KB)`);
      return;
    }

    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // Create backup
    const backupPath = imagePath + '.original';
    try {
      await fs.access(backupPath);
    } catch {
      await fs.copyFile(imagePath, backupPath);
    }

    // Resize if too large
    let processedImage = image;
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      processedImage = processedImage.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Optimize based on format
    if (ext === '.png') {
      await processedImage
        .png({ quality: QUALITY.png, compressionLevel: 9 })
        .toFile(imagePath + '.tmp');
    } else {
      await processedImage
        .jpeg({ quality: QUALITY.jpeg, progressive: true })
        .toFile(imagePath + '.tmp');
    }

    // Replace original with optimized
    await fs.rename(imagePath + '.tmp', imagePath);

    const newStats = await fs.stat(imagePath);
    const newSize = newStats.size;
    const saved = originalSize - newSize;
    const percent = ((saved / originalSize) * 100).toFixed(2);

    console.log(`✅ ${relativePath}`);
    console.log(`   ${(originalSize / 1024).toFixed(2)}KB → ${(newSize / 1024).toFixed(2)}KB (saved ${percent}%)`);
  } catch (error) {
    console.error(`❌ Error optimizing ${relativePath}:`, error.message);
  }
}

async function generateWebP(imagePath) {
  const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  try {
    await sharp(imagePath)
      .webp({ quality: QUALITY.webp })
      .toFile(webpPath);
    
    const stats = await fs.stat(webpPath);
    console.log(`   📦 Generated WebP: ${(stats.size / 1024).toFixed(2)}KB`);
  } catch (error) {
    console.error(`   ❌ Error generating WebP:`, error.message);
  }
}

async function main() {
  console.log('🖼️  Image Optimization Tool\n');
  console.log('📁 Scanning images directory...\n');

  const images = await getAllImages(IMAGES_DIR);
  console.log(`Found ${images.length} images\n`);

  let totalSaved = 0;
  let optimizedCount = 0;

  for (const imagePath of images) {
    const statsBefore = await fs.stat(imagePath);
    await optimizeImage(imagePath);
    
    // Generate WebP version
    if (process.argv.includes('--webp')) {
      await generateWebP(imagePath);
    }
    
    try {
      const statsAfter = await fs.stat(imagePath);
      const saved = statsBefore.size - statsAfter.size;
      if (saved > 0) {
        totalSaved += saved;
        optimizedCount++;
      }
    } catch (e) {
      // Ignore if file doesn't exist
    }
    
    console.log('');
  }

  console.log('\n✨ Optimization Complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   Images optimized: ${optimizedCount}/${images.length}`);
  console.log(`   Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);
  console.log(`\n💡 Tip: Run with --webp flag to generate WebP versions`);
  console.log(`   Example: npm run optimize-images -- --webp`);
}

main().catch(console.error);
