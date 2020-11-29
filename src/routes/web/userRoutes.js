const router = require('express').Router();

const myController = require('../../controllers/myController');
const demoController = require('../../controllers/demoController');

router.use('/demo', myController.index);
router.use('/pug-demo', demoController.my_demo);
router.use('/data-demo', demoController.index);
router.use('/write', demoController.write_file);

router.get('/', (req, res) => res.send('<head><title>Node-Express APIs</title></head><body><h1>Node-Express API Server</h1></body>'));

module.exports = router;
