const express = require('express')
const router = new express.Router()

const myController = require('../controllers/myController')
const demoController = require('../controllers/demoController')
const productsController = require('../controllers/productsController')
const userMySQLController = require('../controllers/userMySQLController')
const userSequelizeController = require('../controllers/userSequelizeController')

router.use('/demo', myController.index)
router.use('/pug-demo', demoController.my_demo)
router.use('/data-demo', demoController.index)
router.use('/write', demoController.write_file)

router.get('/products', productsController.getProducts)
router.get('/products/:id', productsController.getProduct)
router.post('/products', productsController.addProduct)
router.put('/products/:id', productsController.updateProduct)
router.delete('/products/:id', productsController.deleteProduct)

router.get('/users', userMySQLController.getUsers)
router.get('/users/:id', userMySQLController.getUser)
router.post('/users', userMySQLController.addUser)
router.put('/users/:id', userMySQLController.updateUser)
router.delete('/users/:id', userMySQLController.deleteUser)

router.get('/usersequelize', userSequelizeController.getUsers)
router.get('/usersequelize/:id', userSequelizeController.getUser)
router.post('/usersequelize', userSequelizeController.addUser)
router.put('/usersequelize/:id', userSequelizeController.updateUser)
router.delete('/usersequelize/:id', userSequelizeController.deleteUser)

router.get('/usersequelize/:id/mtm', userSequelizeController.getProduct)
router.post('/usersequelize/:id/mtm', userSequelizeController.addProduct)

router.get('/', (req, res) => res.send("<h1>My 1st Express app.</h1>"))

module.exports = router