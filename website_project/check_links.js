const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\91910\\.gemini\\antigravity\\scratch\\website_project';

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            // recurse if needed, but for now we assume flat structure for html or check if 'src' etc are in subdirs
            // actually we should probably skip recurse for now unless we know structure, but let's do simple flat check for .html
        } else {
            if (file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const htmlFiles = getHtmlFiles(projectDir);
let errors = [];

htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.matchAll(/(?:href|src)=["']([^"']+)["']/g);
    for (const match of matches) {
        const link = match[1];
        if (link.startsWith('http') || link.startsWith('#') || link.startsWith('mailto:')) continue;

        const absolutePath = path.join(path.dirname(file), link);
        // Handle query / hashes in local links
        const cleanPath = absolutePath.split('?')[0].split('#')[0];

        if (!fs.existsSync(cleanPath)) {
            errors.push(`File: ${path.basename(file)} - Broken Link: ${link}`);
        }
    }
});

if (errors.length > 0) {
    console.log("Found broken links:");
    errors.forEach(e => console.log(e));
} else {
    console.log("No broken links found.");
}
