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
    explorer: true
  })
);

// serves the swaggger specification
router.get('/swagger.json', (req, res) => {
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(specs, null, 2));
});

module.exports = router;
