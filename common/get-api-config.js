import fs from 'fs';
import path,{ dirname } from 'path';
import { fileURLToPath } from 'url';
export default function getAPIConfig(){
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const apiConfigFileName = path.join(__dirname,`./../${process.env.API_CONFIG_FILE}`);
    const apiConfig = fs.readFileSync(apiConfigFileName, 'utf8');
    return apiConfig;
}