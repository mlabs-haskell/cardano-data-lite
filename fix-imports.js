import { readdirSync, statSync, readFileSync, existsSync, writeFileSync } from "fs";
import { join, resolve, dirname } from "path";

const directory = "./dist"; // Adjust this if your output directory differs

function fixImports(dir) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const fullPath = join(dir, file);

    if (statSync(fullPath).isDirectory()) {
      fixImports(fullPath); // Recursively process subdirectories
    } else if (file.endsWith(".js")) {
      let content = readFileSync(fullPath, "utf-8");

      // Match import paths without extensions or pointing to folders
      const updatedContent = content.replace(
        /from\s+["'](\..*?)["']/g,
        (match, importPath) => {
          const resolvedPath = resolve(dirname(fullPath), importPath);

          if (importPath === ".") {
            // Special case: import "." -> import "./index.js"
            return `from "./index.js"`;
          } else if (existsSync(`${resolvedPath}.js`)) {
            // If the path resolves to a .js file
            return `from "${importPath}.js"`;
          } else if (existsSync(resolvedPath) && statSync(resolvedPath).isDirectory()) {
            // If the path resolves to a directory
            return `from "${importPath}/index.js"`;
          }

          // If the path doesn't resolve, leave it unchanged
          return match;
        }
      );

      writeFileSync(fullPath, updatedContent, "utf-8");
      console.log(`Fixed imports in: ${fullPath}`);
    }
  });
}

fixImports(directory);

