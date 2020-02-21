const express = require('express');
const router = new express.Router();

const auth = require('../middlewares/auth');

router.use('/products', require('./api/productRoutes'));
// router.use('/usermysql', auth.sqlAuthorize, require('./api/userMySQLRoutes'));
// router.use('/usersequelize', auth.sqlAuthorize, require('./api/userSequelizeRoutes'));
// router.use('/usermongodb', auth.mongoAuthorize, require('./api/userMongoDBRoutes'));
// router.use('/usermongoose', auth.mongoAuthorize, require('./api/userMongooseRoutes'));
router.use('/usermysql', require('./api/userMySQLRoutes'));
router.use('/usersequelize', require('./api/userSequelizeRoutes'));
router.use('/usermongodb', require('./api/userMongoDBRoutes'));
router.use('/usermongoose', require('./api/userMongooseRoutes'));

module.exports = router
