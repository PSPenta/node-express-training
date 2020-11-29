const { check } = require('express-validator');
const router = require('express').Router();

const userMySQLController = require('../../controllers/userMySQLController');

router.get('/', userMySQLController.getUsers);
router.get('/:id', userMySQLController.getUser);
router.post('/', check('email').isEmail(), userMySQLController.addUser);
router.put('/:id', check('email').isEmail(), userMySQLController.updateUser);
router.delete('/:id', userMySQLController.deleteUser);

module.exports = router;
