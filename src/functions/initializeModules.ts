import fs from 'fs/promises'
import path from 'path'

export default async function initializeModules(folderPath: string) {
  try {
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      // 1. Filter for .ts or .js files and ignore declaration files (.d.ts)
      if ((file.endsWith('.ts') || file.endsWith('.js')) && !file.endsWith('.d.ts')) {
        const filePath = path.join(folderPath, file);
        
        // 2. Dynamically import the module
        const module = await import(filePath);

        // 3. Check if 'init' exists and is a function
        if (typeof module.init === 'function') {
          await module.init(); 
        }
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}