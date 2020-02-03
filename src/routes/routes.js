const express = require('express');
const router = new express.Router();

const auth = require('../middlewares/auth');
const error404Controller = require('../controllers/error404Controller');
const loginController = require('../controllers/loginController');
const childProcessController = require('../controllers/childProcessController');

// Global swagger definition for Success response format.
/**
 * @swagger
 *  definitions:
 *   Success:
 *    type: object
 *    properties:
 *     success:
 *      type: boolean
 *      default: true
 *     error:
 *      type: string
 *      default: 'null'
 *     data:
 *      type: string
 *      description: Either object or Array.
 */

// Global swagger definition for Error response format.
/**
 * @swagger
 * definitions:
 *  Error:
 *   type: object
 *   properties:
 *    success:
 *     type: boolean
 *     default: false
 *    error:
 *     type: object
 *     properties:
 *      code:
 *       type: string
 *      message:
 *       type: string
 *    data:
 *      type: string
 *      default: 'null'
 */

/**
 * @swagger
 * /login:
 *  get:
 *    security:
 *     - bearerAuth: []
 *    tags:
 *      - Users
 *    name: Users
 *    summary: Verify user creds and give bearer token in response.
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: Body Data
 *        in: body
 *        schema:
 *         type: object
 *         properties:
 *          username:
 *           type: string
 *          password:
 *            type: string
 *    responses:
 *      200:
 *        description: Authorisation Token would be response.
 *        $ref: '#/definitions/Success'
 *      404:
 *        description: User not found.
 *        $ref: '#/definitions/Error'
 *      500:
 *        description: Internal server error.
 *        $ref: '#/definitions/Error'
 * */
router.get('/api/login', loginController.jwtLogin);
router.get('/api/phpChildProcess/php/:name', childProcessController.executePHP);
router.get('/api/phpChildProcess/java/:name', childProcessController.executeJar);
router.use('/api', auth.jwtAuth, require('./apiRoutes'));
// router.use('/api', auth.checkJwt, auth.checkScopes, require('./apiRoutes'))
router.use('/', require('./webRoutes'));

// Handles 404 requests
router.use(error404Controller.error404);

module.exports = router
