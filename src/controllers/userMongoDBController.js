const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

const mailer = require('../config/mailer');
const Product = require('../models/MongoDB/Product');
const User = require('../models/MongoDB/User');

exports.getUsers = async (req, res) => {
  try {
    const user = new User();
    const data = await user.getAll();
    if (data.length) {
      return res.json(data);
    } else {
      return res.status(404).json('No users found!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = new User();
    const data = await user.get(req.params.id);
    if (data) {
      return res.json(data);
    } else {
      return res.status(404).json('User not found!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}

exports.addUser = async (req, res) => {
  try {
    const user = new User();
    const data = await user.get(req.params.id);
    if (data) {
      return res.status(403).json('Username is already taken, please choose a unique one!');
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 256);
      let userData = {
        profile: {
          fname: req.body.fname,
          mname: req.body.mname,
          lname: req.body.lname
        },
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        apiToken: randomstring.generate()
      };
      const data = await user.save(userData);
      if (data.insertedCount) {
        mailer.sendMail(
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
        ).then(() => console.info('Email sent successfully!')).catch(err => console.error(err));
        return res.status(201).json('User added successfully!');
      } else {
        return res.status(404).json('Could not create profile for user!');
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = new User();
    const hashedPassword = await bcrypt.hash(req.body.password, 256);
    let userData = {
      profile: {
        fname: req.body.fname,
        mname: req.body.mname,
        lname: req.body.lname
      },
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      apiToken: randomstring.generate()
    };
    const data = await user.update(userData, req.params.id);
    if (data.modifiedCount) {
      return res.status(201).json('User updated successfully!');
    } else {
      return res.status(404).json('User not updated!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = new User();
    const data = await user.delete(req.params.id);
    if (data.deletedCount) {
      return res.json('User deleted successfully!');
    } else {
      return res.status(404).json('User not deleted!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const product = new Product();
    const data = await product.getAll();
    if (data.length) {
      return res.json(data);
    } else {
      return res.status(404).json('No products found!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}

exports.getUserProducts = async (req, res) => {
  try {
    const user = new User();
    const userData = await user.get(req.params.id);
    if (userData) {
      if (userData.products) {
        const productData = await user.getProducts(userData.products);
        if (productData.length) {
          return res.json(productData);
        } else {
          return res.status(404).json('Product not found!');
        }
      } else {
        return res.status(404).json('No products assigned to users!');
      }
    } else {
      return res.status(404).json('User not found!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}

exports.createProduct = async (req, res) => {
  try {
    const product = new Product();
    const data = await product.save(req.body);
    if (data.insertedCount) {
      return res.status(201).json('Product added successfully!');
    } else {
      return res.status(404).json('Something went wrong!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const product = new Product();
    const data = await product.update(req.body, req.params.id);
    if (data.modifiedCount) {
      return res.status(201).json('Product updated successfully!');
    } else {
      return res.status(201).json('Product not updated!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}

exports.addNewProduct = async (req, res) => {
  try {
    const user = new User();
    const oldUserData = await user.get(req.params.id);
    if (oldUserData) {
      const product = new Product();
      const productData = await product.save(req.body);
      if (oldUserData.products) {
        oldUserData.products.push(productData.insertedId);
      } else {
        oldUserData.products = [productData.insertedId];
      }
      const updatedUserData = await user.update(oldUserData, req.params.id);
      if (productData.insertedCount && updatedUserData.modifiedCount) {
        return res.status(201).json('Product added and assigned to user successfully!');
      } else {
        return res.status(404).json('Could not assign product for user!');
      }
    } else {
      return res.status(404).json('User not found!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}

exports.assignProduct = async (req, res) => {
  try {
    const user = new User();
    const userData = await user.get(req.params.uid);
    if (userData) {
      const product = new Product();
      const productData = await product.get(req.params.pid);
      if (productData) {
        if (userData.products) {
          userData.products.push(productData._id);
        } else {
          userData.products = [productData._id];
        }
        const userUpdateData = await user.update(userData, req.params.uid);
        if (userUpdateData.modifiedCount) {
          return res.status(201).json('Product assigned successfully!');
        } else {
          return res.status(404).json('Could not assign product for user!');
        }
      } else {
        return res.status(404).json('Product not found!');
      }
    } else {
      return res.status(404).json('User not found!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = new Product();
    const productData = await product.get(req.params.id);
    if (productData) {
      const user = new User();
      const userData = await user.findByProduct(req.params.id);
      const data = await product.delete(req.params.id);
      if (data.deletedCount && userData.length) {
        userData.forEach(async eachUser => {
          newProducts = (eachUser.products).filter(product => product.toString() !== productData._id.toString());
          eachUser.products = newProducts;
          await user.update(eachUser, eachUser._id);
        });
        res.json('Product deleted and cascaded successfully!');
      } else {
        res.json('Product deleted successfully!');
      }
    } else {
      res.status(404).json('No product to delete!');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong!');
  }
}
