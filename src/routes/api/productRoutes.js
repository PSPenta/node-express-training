const router = require('express').Router();

const productsController = require('../../controllers/productsController');

/**
 * @swagger
 * /products:
 *  get:
 *    security:
 *     - bearerAuth: []
 *    tags:
 *      - Products
 *    name: Products
 *    summary: Fetch all products
 *    consumes:
 *      - application/json
 *    produces:
 *      - application/json
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
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProduct);
router.post('/', productsController.addProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
