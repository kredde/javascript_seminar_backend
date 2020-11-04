import bbbJs from 'bigbluebutton-js';
import config from './config';

const bbb = { api: bbbJs.api(`${config.bbbFqdn}bigbluebutton/`, config.bbbSecret) };

export default bbb;
