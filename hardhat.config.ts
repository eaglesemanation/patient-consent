
import {HardhatUserConfig} from 'hardhat/config';

let config: HardhatUserConfig;

if(process.env.NODE_ENV === 'dev') {
    config = require('./hardhat.config.dev');
} else {
    config = require('./hardhat.config.prod');
}

export default config;
