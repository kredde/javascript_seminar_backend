import cryptoRandomString from 'crypto-random-string';

const generatePassword = (l) => {
  return cryptoRandomString({ length: l, type: 'url-safe' });
};

export default generatePassword;
