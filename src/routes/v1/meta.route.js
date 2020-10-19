const express = require('express');
const metaController = require('../../controllers/meta.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Meta
 *   description: Meta informations languages and subjects
 */

/**
 * @swagger
 * path:
 *  /languages:
 *    get:
 *      summary: Get list of valid languages
 *      tags: [Meta]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                      name: string
 *                      value: string
 *                  example:
 *                     name: German
 *                     value: de
 */
router.get('/languages', metaController.getLanguages);

/**
 * @swagger
 * path:
 *  /subjects:
 *    get:
 *      summary: Get list of valid subjects
 *      tags: [Meta]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                      name: string
 *                      value: string
 *                  example:
 *                     name: Mathematics
 *                     value: mathematics
 */
router.get('/subjects', metaController.getSubjects);

/**
 * @swagger
 * path:
 *  /countries:
 *    get:
 *      summary: Get list of valid countries
 *      tags: [Meta]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                      name: string
 *                      value: string
 *                  example:
 *                     name: Germany
 *                     value: de
 */
router.get('/countries', metaController.getCountries);

module.exports = router;
