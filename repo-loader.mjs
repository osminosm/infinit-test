import fetch from 'node-fetch';
import fs from 'fs';
import yauzl from 'yauzl';
import { promisify } from 'util';
import path from 'path';

const repoURL = 'https://github.com/lodash/lodash/archive/main.zip';

const openZip = promisify(yauzl.open);

async function downloadZip(url, dest) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    const fileStream = fs.createWriteStream(dest);
    await new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on('error', (err) => {
            reject(err);
        });
        fileStream.on('finish', function () {
            resolve();
        });
    });
}

async function extractZip(zipPath, dest) {
    await fs.promises.mkdir(dest, { recursive: true });
    const zipfile = await openZip(zipPath, { lazyEntries: true });
    return new Promise((resolve, reject) => {
        zipfile.on('error', reject);
        zipfile.on('entry', (entry) => {
            if (!entry.fileName.endsWith('/') && ['.js', ".ts"].reduce((acc, ext) => acc || entry.fileName.endsWith(ext), false)) {
                
                    // Create directories for the file if they don't exist
                    const directory = path.dirname(`${dest}/${entry.fileName}`);
                    fs.promises.mkdir(directory, { recursive: true })
                        .then(() => {
                            // Extract the file
                            zipfile.openReadStream(entry, (err, readStream) => {
                                if (err) reject(err);
                                const writeStream = fs.createWriteStream(`${dest}/${entry.fileName}`);
                                readStream.pipe(writeStream);
                                writeStream.on('close', () => {
                                    zipfile.readEntry();
                                });
                            });
                        })
                        .catch(reject);
                
            } else {
                // Skip directory entries
                zipfile.readEntry();
            }
        });
        zipfile.on('end', () => {
            resolve();
        });
        zipfile.readEntry();
    });
}

export async function getRepositoryFiles() {
    const tempZipPath = 'temp.zip';
    const extractDest = 'temp-files';

    try {
        console.log('Downloading zip file...');
        await downloadZip(repoURL, tempZipPath);
        console.log('Zip file downloaded successfully.');

        console.log('Extracting zip file...');
        await extractZip(tempZipPath, extractDest);
        console.log('Zip file extracted successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        // Cleanup: Delete the temporary zip file
        fs.unlink(tempZipPath, err => {
            if (err) console.error('Error deleting temporary zip file:', err);
        });
    }
}
