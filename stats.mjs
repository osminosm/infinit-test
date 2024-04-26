import fs from 'fs';
import path from 'path';

// Function to recursively read all files in a directory
async function readAllFilesInDirectory(dirPath) {
    let files = [];
    const dirents = await fs.promises.readdir(dirPath, { withFileTypes: true });
    for (const dirent of dirents) {
        const fullPath = path.join(dirPath, dirent.name);
        if (dirent.isDirectory()) {
            const nestedFiles = await readAllFilesInDirectory(fullPath);
            files = files.concat(nestedFiles);
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

// Function to count occurrences of each character in a string
function countCharacters(content) {
    const charCount = {};
    for (const char of content) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    return charCount;
}

// Main function to read all files in a directory, extract content, and count characters
export async function getStats() {
    const directoryPath = 'temp-files'; // Replace with the path to your directory
    const allFiles = await readAllFilesInDirectory(directoryPath);
    const charCount = {};

    for (const file of allFiles) {
        const fileContent = await fs.promises.readFile(file, 'utf8');
        const fileCharCount = countCharacters(fileContent);
        for (const char in fileCharCount) {
            charCount[char] = (charCount[char] || 0) + fileCharCount[char];
        }
    }

    console.log('Character occurrences in all files:');
    console.log(charCount);
}