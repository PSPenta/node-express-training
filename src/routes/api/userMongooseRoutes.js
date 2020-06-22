const express = require('express');
const { check } = require('express-validator');
const router = new express.Router();

const userMongooseController = require('../../controllers/userMongooseController');
const { imgUploadToS3 } = require('../../helpers/awsHelper');

router.route('/products')
  .get(userMongooseController.getAllProducts)
  .post(
    [
      check('name')
        .matches(/^[A-Za-z0-9\s]+$/).withMessage('The name must be alphabetic or alphanumeric only!')
        .isLength({ min: 5, max: 15 }).withMessage('The name must be between 8 to 15 digits!'),
      check('price')
        .matches(/([0-9]*[.])?[0-9]+$/).withMessage('The price must be numeric or decimal point number only!')
        .isLength({ min: 8, max: 15 }).withMessage('The price must be between 8 to 15 digits!'),
      check('description')
        .matches(/^[A-Za-z\s]+$/).withMessage('The description must be alphabetic!')
        .isLength({ min: 15, max: 255 }).withMessage('The description must be 15 to 255 characters!')
    ],
    userMongooseController.createProduct
  );

router.route('/products/:productId')
  .put(
    [
      check('name')
        .matches(/^[A-Za-z0-9\s]+$/).withMessage('The name must be alphabetic or alphanumeric only!')
        .isLength({ min: 5, max: 15 }).withMessage('The name must be between 8 to 15 digits!'),
      check('price')
        .matches(/([0-9]*[.])?[0-9]+$/).withMessage('The price must be numeric or decimal point number only!')
        .isLength({ min: 8, max: 15 }).withMessage('The price must be between 8 to 15 digits!'),
      check('description')
        .matches(/^[A-Za-z\s]+$/).withMessage('The description must be alphabetic!')
        .isLength({ min: 15, max: 255 }).withMessage('The description must be 15 to 255 characters!')
    ],
    userMongooseController.updateProduct
  )
  .delete(userMongooseController.deleteProduct);


router.route('/products/:userId/mtm')
  .get(userMongooseController.getUserProducts)
  .post(
    [
      check('name')
        .matches(/^[A-Za-z0-9\s]+$/).withMessage('The name must be alphabetic or alphanumeric only!')
        .isLength({ min: 5, max: 15 }).withMessage('The name must be between 8 to 15 digits!'),
      check('price')
        .matches(/([0-9]*[.])?[0-9]+$/).withMessage('The price must be numeric or decimal point number only!')
        .isLength({ min: 8, max: 15 }).withMessage('The price must be between 8 to 15 digits!'),
      check('description')
        .matches(/^[A-Za-z\s]+$/).withMessage('The description must be alphabetic!')
        .isLength({ min: 15, max: 255 }).withMessage('The description must be 15 to 255 characters!')
    ],
    userMongooseController.addNewProduct
  );

router.route('/products/:productId/image')
  .get(userMongooseController.getProductImage)
  .post(imgUploadToS3.single('image'), userMongooseController.addNewProductImage);

router.post('/products/:userId/:productId', userMongooseController.assignProduct);


router.route('/')
  .get(userMongooseController.getUsers)
  .post(
    [
      check('fname')
        .matches(/^[A-Za-z\s]+$/).withMessage('The firstname must be alphabetic!')
        .isLength({ min: 5 }).withMessage('The firstname must be more than 5 characters!'),
      check('mname')
        .matches(/^[A-Za-z\s]+$/).withMessage('The middlename must be alphabetic!'),
      check('lname')
        .matches(/^[A-Za-z\s]+$/).withMessage('The lastname must be alphabetic!')
        .isLength({ min: 5 }).withMessage('The lastname must be more than 5 characters!'),
      check('username')
        .matches(/^[A-Za-z0-9\s]+$/).withMessage('The username must be alphabetic or alphanumeric only!')
        .isLength({ min: 5, max: 15 }).withMessage('The username length must be between 5 and 15!'),
      check('email').isEmail().normalizeEmail(),
      check('password', '...')
        .isLength({ min: 8, max: 15 }).withMessage('The password length must be between 8 and 15!')
        .matches(/^(?=.*\d)(?=.*[!@#$&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$&*]{8,15}$/, "i").withMessage('The password must contain atleast 1 uppercase, 1 lowercase, 1 special character and 1 number!'),
      check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match with password!');
        }

        // Indicates the success of this synchronous custom validator
        return true;
      })
    ],
    userMongooseController.addUser
  );

router.route('/:userId')
  .get(userMongooseController.getUser)
  .put(
    [
      check('fname')
        .matches(/^[A-Za-z\s]+$/).withMessage('The firstname must be alphabetic!')
        .isLength({ min: 5 }).withMessage('The firstname must be more than 5 characters!'),
      check('mname')
        .matches(/^[A-Za-z\s]+$/).withMessage('The middlename must be alphabetic!'),
      check('lname')
        .matches(/^[A-Za-z\s]+$/).withMessage('The lastname must be alphabetic!')
        .isLength({ min: 5 }).withMessage('The lastname must be more than 5 characters!'),
      check('username')
        .matches(/^[A-Za-z0-9\s]+$/).withMessage('The username must be alphabetic or alphanumeric only!')
        .isLength({ min: 5, max: 15 }).withMessage('The username length must be between 5 and 15!'),
      check('email').isEmail().normalizeEmail(),
      check('password', '...')
        .isLength({ min: 8, max: 15 }).withMessage('The password length must be between 8 and 15!')
        .matches(/^(?=.*\d)(?=.*[!@#$&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$&*]{8,15}$/, "i").withMessage('The password must contain atleast 1 uppercase, 1 lowercase, 1 special character and 1 number!'),
      check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match with password!');
        }

        // Indicates the success of this synchronous custom validator
        return true;
      })
    ],
    userMongooseController.updateUser
  )
  .delete(userMongooseController.deleteUser);


router.get('/:productId/pdf', userMongooseController.generatePDF);

module.exports = router
