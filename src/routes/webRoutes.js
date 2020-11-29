const router = require('express').Router();

router.use('/admin', require('./web/adminRoutes'));
router.use('/', require('./web/userRoutes'));

module.exports = router;
