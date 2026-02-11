
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inventoryPath = path.join(__dirname, 'frontend/src/data/inventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

const generateTranslations = (lang) => {
    const translations = {};
    inventory.forEach(item => {
        translations[item.id] = {
            title: item.title + (lang === 'en' ? '' : (lang === 'si' ? ' (SI)' : ' (TA)')),
            description: item.description + (lang === 'en' ? '' : (lang === 'si' ? ' (SI)' : ' (TA)'))
        };
    });
    return translations;
};

const enData = generateTranslations('en');
const siData = generateTranslations('si');
const taData = generateTranslations('ta');

console.log('---EN---');
console.log(JSON.stringify(enData, null, 4));
console.log('---SI---');
console.log(JSON.stringify(siData, null, 4));
console.log('---TA---');
console.log(JSON.stringify(taData, null, 4));
