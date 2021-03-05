import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });

import {HardhatUserConfig} from 'hardhat/config';

let config: HardhatUserConfig;

if(process.env.NODE_ENV === 'dev') {
    config = require('./hardhat.config.dev');
} else {
    config = require('./hardhat.config.prod');
}

export default config;
