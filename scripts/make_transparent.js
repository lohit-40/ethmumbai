import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';

const assetsDir = path.join(process.cwd(), 'public', 'assets');
const fileConfig = [
    { name: 'city-layer.png', key: 'white' },
    { name: 'bus-layer.png', key: 'magenta' },
    { name: 'road-layer.png', key: 'magenta' },
    { name: 'balloon-layer.png', key: 'magenta' }
];

async function processImage(config) {
    const filename = config.name;
    const type = config.key;
    const filePath = path.join(assetsDir, filename);

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    try {
        const image = await Jimp.read(filePath);

        // Scan every pixel
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
            const red = image.bitmap.data[idx + 0];
            const green = image.bitmap.data[idx + 1];
            const blue = image.bitmap.data[idx + 2];

            if (type === 'magenta') {
                // Remove Magenta (with tolerance)
                if (red > 150 && green < 100 && blue > 150) {
                    image.bitmap.data[idx + 3] = 0;
                }
            } else if (type === 'white') {
                // Remove White (High RGB values)
                if (red > 230 && green > 230 && blue > 230) {
                    image.bitmap.data[idx + 3] = 0;
                }
            }
        });

        await image.write(filePath);
        console.log(`Processed ${filename}: Removed ${type} background.`);
    } catch (err) {
        console.error(`Error processing ${filename}:`, err);
    }
}

async function main() {
    console.log("Starting transparency processing...");
    for (const config of fileConfig) {
        await processImage(config);
    }
    console.log("Done.");
}

main();
