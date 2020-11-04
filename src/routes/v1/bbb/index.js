import Router from 'express-promise-router';

import * as bbbController from '~/controllers/bbb';

const bbbRouter = Router();
const route = '/bbb';

bbbRouter.use(route, bbbController.administrationRouter);
bbbRouter.use(route, bbbController.monitoringRouter);
bbbRouter.use(route, bbbController.recordingRouter);
bbbRouter.get(route, bbbController.get);

export default bbbRouter;

/**
 * @swagger
 * tags:
 *  - name: bbb
 *    description: base route
 */

/**
 * @swagger
 *
 * /:
 *  get:
 *    tags:
 *    - bbb
 *    summary: Forbidden
 *    responses:
 *      403:
 *        description: Forbidden
 */
