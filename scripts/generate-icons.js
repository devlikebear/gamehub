const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// PWA icons
const pwaIcons = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// Favicon sizes
const faviconIcons = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // Apple touch icon
];

const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');
const publicDir = path.join(__dirname, '../public');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('🎨 Generating PWA icons and favicons...\n');

  // Generate PWA icons
  console.log('📱 PWA Icons:');
  for (const { size, name } of pwaIcons) {
    const outputPath = path.join(outputDir, name);
    try {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`  ✅ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`  ❌ Failed to generate ${name}:`, error.message);
    }
  }

  // Generate favicon icons
  console.log('\n🔖 Favicons:');
  for (const { size, name } of faviconIcons) {
    const outputPath = path.join(publicDir, name);
    try {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`  ✅ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`  ❌ Failed to generate ${name}:`, error.message);
    }
  }

  // Generate favicon.ico (32x32 is standard)
  console.log('\n🌐 Generating favicon.ico...');
  try {
    const icoPath = path.join(publicDir, 'favicon.ico');
    await sharp(inputSvg)
      .resize(32, 32)
      .png()
      .toFile(icoPath);
    console.log('  ✅ Generated favicon.ico');
  } catch (error) {
    console.error('  ❌ Failed to generate favicon.ico:', error.message);
  }

  console.log('\n🎉 Icon generation complete!');
}

generateIcons().catch(console.error);
