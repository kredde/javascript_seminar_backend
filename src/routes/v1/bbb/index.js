import Router from 'express-promise-router';

import * as bbbController from '~/controllers/bbb';
// import auth from '~/middlewares/auth';

const bbbRouter = Router();
const route = '/bbb';

bbbRouter.use(route, /* auth('teacher'), */ bbbController.administrationRouter);
bbbRouter.use(route, /* auth('teacher'), */ bbbController.monitoringRouter);
bbbRouter.use(route, /* auth('teacher'), */ bbbController.recordingRouter);
bbbRouter.get(route, /* auth(), */ bbbController.get);

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
