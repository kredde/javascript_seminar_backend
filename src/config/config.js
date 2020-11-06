const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    HTTPS: Joi.string().valid('true', 'false').default('false').description('whether to use https or not'),
    INSECURE: Joi.string().valid('true', 'false').default('false').description('true with self-signed certificate'),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    FRONTEND_HOST: Joi.string(),
    BACKEND_HOST: Joi.string(),

    // Temporary
    BBB_ENABLE: Joi.string()
      .valid('true', 'false')
      .default('false')
      .description('use to temporarily disable bbb for integration'),

    // Temporary - Uncomment this when removing BBB_ENABLE
    // BBB_FQDN: Joi.string().required().description('bbb server fqdn'),
    // BBB_SECRET: Joi.string().required().description('bbb api secret'),
    BBB_FQDN: Joi.when('BBB_ENABLE', { is: 'true', then: Joi.string().required().description('bbb server fqdn') }),
    BBB_SECRET: Joi.when('BBB_ENABLE', { is: 'true', then: Joi.string().required().description('bbb api secret') }),

    BBB_P_KEY: Joi.when('HTTPS', { is: 'true', then: Joi.string().required() }).description('path to bbb private key'),
    BBB_P_CERT: Joi.when('HTTPS', { is: 'true', then: Joi.string().required() }).description('path to bbb cert')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  https: envVars.HTTPS,
  insecure: envVars.INSECURE,
  port: envVars.PORT,
  frontendHost: envVars.FRONTEND_HOST,
  backendHost: envVars.BACKEND_HOST,
  bbbEnable: envVars.BBB_ENABLE,
  bbbFqdn: envVars.BBB_FQDN,
  bbbSecret: envVars.BBB_SECRET,
  bbbKey: envVars.BBB_P_KEY,
  bbbCert: envVars.BBB_P_CERT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD
      }
    },
    from: envVars.EMAIL_FROM
  }
};
