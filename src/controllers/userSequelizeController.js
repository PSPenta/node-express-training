const fs = require('fs');
const path = require('path');

const { hash } = require('bcrypt');
const { validationResult } = require('express-validator');
const { create: currentDateTime } = require('node-datetime');
const PDFDocument = require('pdfkit');
const { generate: generateRandomString } = require('randomstring');
const { Op } = require('sequelize');

const { sendMail } = require('../config/mailer');
const { model } = require('../helpers/sequelizeHelper');
const { responseObj } = require('../helpers/utilsHelper');

exports.getUsers = async (req, res) => {
  try {
    const users = await model('User').paginate({
      attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
      include: [
        {
          model: model('Profile'),
          attributes: ['fname', 'mname', 'lname']
        },
        {
          model: model('Product'),
          attributes: ['id', 'name', 'description', 'image', 'price'],
          through: {
            attributes: []
          }
        }
      ],
      page: req.query.page ? req.query.page : 1,     // Default 1
      paginate: 4                                    // Default 25
    });

    users.page = req.query.page ? req.query.page : 1;
    users.limit = 4;
    if (users) {
      return res.json(responseObj(null, true, users, true));
    } else {
      return res.status(404).json(responseObj('No users found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await model('User').findAll({
      attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
      where: { id: parseInt(req.params.userId) },
      include: [{
        model: model('Profile'),
        as: 'profile',
        attributes: ['fname', 'mname', 'lname']
      }]
    });

    if (user.length) {
      return res.json(responseObj(null, true, user));
    } else {
      return res.status(404).json(responseObj('No users found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.addUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(responseObj(errors.array()));
    }

    const user = await model('User').findAll({
      where: {
        [Op.or]: [
          { username: req.body.username },
          { email: req.body.email }
        ]
      }
    });

    if (!user.length) {
      const hashedPassword = await hash(req.body.password, 256);
      const user = await model('User').create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        api_token: generateRandomString(),
        api_token_created_at: currentDateTime().format('Y-m-d H:M:S')
      });

      if (user) {
        const profile = await user.createProfile({
          fname: req.body.fname,
          mname: req.body.mname,
          lname: req.body.lname
        });

        if (profile) {
          sendMail(
            req.body.email,
            process.env.EMAIL_FROM_ADDRESS,
            'Node App Signin',
            `<p>
              Hi ${req.body.fname},<br>
              Your account has been created successfully.<br>
              Please find your credentials mentioned below :<br>
              Username: ${req.body.username}<br>
              Password: ${req.body.password}<br>
              Thank you for joining us. Good luck.<br>
            </p>`
          ).then(() => console.log('Email sent successfully!')).catch(err => console.error(err));

          return res.status(201).json(responseObj(null, true, { 'message': 'User added successfully!' }));
        } else {
          return res.status(404).json(responseObj('Could not create profile for user!'));
        }
      } else {
        return res.status(404).json(responseObj('Could not create user!'));
      }
    } else {
      return res.status(404).json(responseObj('Username or email is already taken, please choose a unique one!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(responseObj(errors.array()));
    }

    const user = await model('User').findAll({
      where: {
        [Op.or]: [
          { username: req.body.username },
          { email: req.body.email }
        ]
      }
    });

    if (!user.length || user[0].id == parseInt(req.params.userId)) {
      const user = await model('User').findAll({ where: { id: parseInt(req.params.userId) } });
      if (user && user.length) {
        const hashedPassword = await hash(req.body.password, 256);
        user[0].username = req.body.username;
        user[0].email = req.body.email;
        user[0].password = hashedPassword;
        user[0].api_token = generateRandomString();
        user[0].api_token_created_at = currentDateTime().format('Y-m-d H:M:S');
        user[0].save();

        const profile = await user[0].getProfile();
        if (profile) {
          profile.fname = req.body.fname;
          profile.mname = req.body.mname;
          profile.lname = req.body.lname;
          profile.save();
        } else {
          newProfile = await user[0].createProfile({
            fname: req.body.fname,
            mname: req.body.mname,
            lname: req.body.lname
          });
        }

        if (profile || newProfile) {
          return res.status(201).json(responseObj(null, true, { 'message': 'User updated successfully!' }));
        } else {
          return res.status(404).json(responseObj('Could not update profile of user!'));
        }
      } else {
        return res.status(404).json(responseObj('Could not update user!'));
      }
    } else {
      return res.status(404).json(responseObj('Username or email is already taken, please choose a unique one'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await model('User').findAll({ where: { id: parseInt(req.params.userId) } });
    if (user[0]) {
      const profile = await user[0].getProfile();
      if (profile) {
        profile.destroy();
      }
      user[0].destroy();
      return res.json(responseObj(null, true, { 'message': 'User deleted successfully!' }));
    } else {
      return res.status(404).json(responseObj('User not found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const products = await model('Product').paginate({
      page: req.query.page ? req.query.page : 1,
      paginate: 4
    });

    products.page = req.query.page ? req.query.page : 1;
    products.limit = 4;
    return res.json(responseObj(null, true, products, true));
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.getProduct = async (req, res) => {
  try {
    const userProducts = await model('User').findAll({
      where: { id: parseInt(req.params.userId) },
      attributes: [],
      include: [{
        model: model('Product'),
        attributes: ['id', 'name', 'description', 'image', 'price'],
        through: {
          attributes: []
        }
      }]
    });

    if (userProducts.length) {
      if (userProducts[0].products.length) {
        return res.json(responseObj(null, true, userProducts));
      } else {
        return res.status(404).json(responseObj('No products found for this user!'));
      }
    } else {
      return res.status(404).json(responseObj('User not found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(responseObj(errors.array()));
    }

    const product = await model('Product').create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    });

    if (product) {
      return res.status(201).json(responseObj(null, true, { 'message': 'Product added successfully!' }));
    } else {
      return res.status(404).json(responseObj('Could not create product!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(responseObj(errors.array()));
    }

    const product = await model('Product').update(
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
      },
      {
        where: { id: parseInt(req.params.productId) }
      }
    );

    if (product) {
      return res.status(201).json(responseObj(null, true, { 'message': 'Product updated successfully!' }));
    } else {
      return res.status(404).json(responseObj('Could not update product!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await model('Product').destroy({ where: { id: parseInt(req.params.productId) } });
    if (product) {
      return res.json(responseObj(null, true, { 'message': 'Product deleted and cascaded successfully!' }));
    } else {
      return res.status(404).json(responseObj('Product not found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.addNewProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(responseObj(errors.array()));
    }

    const user = await model('User').findAll({ where: { id: parseInt(req.params.userId) } });
    if (user.length) {
      const product = await user[0].createProduct({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      });

      if (product) {
        return res.status(201).json(responseObj(null, true, { 'message': 'Product created successfully!' }));
      } else {
        return res.status(404).json(responseObj('Could not create product for user!'));
      }
    } else {
      return res.status(404).json(responseObj('User not found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.addNewProductImage = async (req, res) => {
  try {
    const product = await model('Product').findAll({ where: { id: parseInt(req.params.productId) } });
    if (product.length) {
      if (req.file) {
        product[0].image = req.file.location;
        product[0].save();
        return res.status(201).json(responseObj(null, true, { 'message': 'Image assigned to product successfully!' }));
      } else {
        return res.status(404).json(responseObj('No image found to upload!'));
      }
    } else {
      return res.status(404).json(responseObj('Product not found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.getProductImage = async (req, res) => {
  try {
    const product = await model('Product').findAll({ where: { id: parseInt(req.params.productId) } });
    if (product.length) {
      /**** Sending file path in response */
      // return res.status(200).json(responseObj(null, true, product[0].image));

      /**** Reading the entire file to make it available for users */
      // fs.readFile(path.join(path.dirname(process.mainModule.filename), product[0].image), (err, data) => {
      //   if (err) {
      //     return res.status(404).json(responseObj('File not found!'));
      //   }
      //   res.setHeader('Content-Type', 'application/jpg');
      //   res.setHeader('Content-Disposition', `inline; filename=${product[0].image}`);
      //   return res.status(200).json(responseObj(null, true, data));
      // });

      /**** Streaming the file for users */
      const file = fs.createReadStream(path.join(path.dirname(process.mainModule.filename), product[0].image));
      res.setHeader('Content-Type', 'application/jpg');
      res.setHeader('Content-Disposition', `inline; filename=${product[0].image}`);
      file.pipe(res);
    } else {
      return res.status(404).json(responseObj('Product not found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.generatePDF = async (req, res) => {
  try {
    const product = await model('Product').findAll({ where: { id: parseInt(req.params.productId) } });
    if (product.length) {
      const pdfDoc = new PDFDocument();
      const pdf = new Date().toISOString() + '-' + 'myTestPDF.pdf';

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${pdf}`);

      pdfDoc.pipe(fs.createWriteStream(path.join(path.dirname(process.mainModule.filename), 'src/public/files/images', pdf)));
      pdfDoc.pipe(res);
      pdfDoc.text('Hello World!');
      pdfDoc.fontSize(18).text('Hello World!', {
        underline: true
      });
      pdfDoc.end();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.assignProduct = async (req, res) => {
  try {
    const user = await model('User').findAll({ where: { id: parseInt(req.params.userId) } });
    if (user.length) {
      const product = await model('Product').findAll({ where: { id: parseInt(req.params.productId) } });
      if (product.length) {
        data = await user[0].addProduct(product[0]);
        if (data) {
          return res.status(201).json(responseObj(null, true, { 'message': 'Product assigned successfully!' }));
        } else {
          return res.status(404).json(responseObj('Could not assign product for user!'));
        }
      } else {
        return res.status(404).json(responseObj('No product found!'));
      }
    } else {
      return res.status(404).json(responseObj('User not found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}
