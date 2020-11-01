const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../../docs/swaggerDef');

const router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml', 'src/routes/v1/*.js']
});

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: false,
    validatorUrl: null
  })
);

const getSchema = (fullSchema, path) => {
  let schema = fullSchema;
  path.forEach((p) => {
    schema = schema[p];
  });
  return schema;
};

const embedComponents = (obj, parent, parentKey, fullSchema) => {
  if (!obj || typeof obj !== 'object') return;

  Object.keys(obj).forEach((key) => {
    if (key === '$ref') {
      const path = obj[key].replace('#/', '').split('/');
      const schema = getSchema(fullSchema, path);
      // eslint-disable-next-line
      parent[parentKey] = schema;
    } else {
      embedComponents(obj[key], obj, key, fullSchema);
    }
  });
};

const removeGamingRoutes = (schema) => {
  const obj = { ...schema };
  Object.keys(obj.paths).forEach((key) => {
    if (key.startsWith('/games')) {
      delete obj.paths[key];
    }
  });
  return obj;
};

// serves the swaggger specification
router.get('/swagger.json', (req, res) => {
  res.header('Content-Type', 'application/json');
  const schema = removeGamingRoutes(specs);
  embedComponents(schema, null, null, schema);
  res.send(JSON.stringify(schema, null, 2));
});

module.exports = router;
