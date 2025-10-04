// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { exec } = require("child_process");

const sharedDir = path.join(__dirname, "../../shared");

console.log("👀 Watching shared directory for changes...");
console.log(sharedDir);
// Check if source directory exists before watching
if (!fs.existsSync(sharedDir)) {
  console.error('❌ Source directory ../shared does not exist');
  process.exit(1);
}

// Watch for changes in the shared directory
fs.watch(sharedDir, { recursive: true }, (eventType, filename) => {
  if (filename) {
    // Skip changes to excluded files/directories
    const excludedItems = ['node_modules', '.gitignore', 'package-lock.json', 'package.json'];
    const shouldSkip = excludedItems.some(item => 
      filename === item || filename.startsWith(item + '/') || filename.includes('/' + item + '/')
    );
    
    if (shouldSkip) {
      return;
    }

    console.log(`📝 Detected change in shared/${filename}`);

    // Run copy script
    exec("npm run copy-shared", (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Failed to copy shared files:", error);
        return;
      }
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    });
  }
});

console.log("Press Ctrl+C to stop watching");
