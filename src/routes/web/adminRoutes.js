const router = require('express').Router();

router.use('/', (req, res) => res.render('admin/admin', {title:'Admin', message:'Admin section!'}));

// router.use('/', (req, res) => {
//   req.flash('error', 'Invalid content!');
//   res.render('admin/admin', {title:'Admin', message:'Admin section!', errorMsg: req.flash('error')});
// });

module.exports = router;
