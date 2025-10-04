// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const sourceDir = path.join(__dirname, '../../shared');
const targetDir = path.join(__dirname, '../shared');

// Function to recursively copy directory
function copyDirectory(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const items = fs.readdirSync(src);

  for (const item of items) {
    // Skip specified files and directories
    if (item === 'node_modules' || 
        item === '.gitignore' || 
        item === 'package-lock.json' || 
        item === 'package.json') {
      continue;
    }

    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stats = fs.statSync(srcPath);

    if (stats.isDirectory()) {
      // Recursively copy subdirectory
      copyDirectory(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Remove existing shared directory if it exists
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
  console.log('🗑️  Removed existing shared directory');
}

try {
  // Check if source directory exists
  if (!fs.existsSync(sourceDir)) {
    console.error('❌ Source directory ../shared does not exist');
    process.exit(1);
  }

  // Copy the directory
  copyDirectory(sourceDir, targetDir);
  console.log('✅ Shared files copied successfully');
  
  // Show what was copied
  const copiedItems = fs.readdirSync(targetDir);
  console.log(`📁 Copied: ${copiedItems.join(', ')}`);
  
} catch (error) {
  console.error('❌ Failed to copy shared files:', error.message);
  process.exit(1);
}