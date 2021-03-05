import jwt from "jsonwebtoken";
import moment from "moment";
import { Product, User, Sequelize as Op } from "../models";
import { mailSender } from "../util";
import dotenv from "dotenv";
dotenv.config();

export const authSuccess = async (req, res) => {
  try {
    res.status(200).json({
      userID: req.user.userID,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.userEmail,
      name: req.user.name,
    });
  } catch (err) {
    console.log("authSuccess");
    console.log(err);
    return res.status(400).send(err).json({
      success: false,
      message: "Error occurred at authSuccess",
    });
  }
};

// export const userDetail = async (req, res) => {
//   res.status(200).json({
//     userID: req.user[0].userID, //수정
//     isAdmin: req.user.role === 0 ? false : true,
//     isAuth: true,
//     email: req.user[0].userEmail,
//     name: req.user[0].name,
//   });
// };

export const register = async (req, res) => {
  const {
    body: { userID, email, password },
  } = req;
  try {
    const user = await User.findOne({
      attributes: ["id"],
      where: {
        userID,
      },
    });
    if (!user) {
      //이매일 중복 확인
      User.create({
        userID,
        userEmail: email,
        userPassword: password,
      });
      mailSender.sendGmail(req);
      return res.status(200).json({
        success: true,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "The email is already exsisted.",
      });
    }
  } catch (err) {
    console.log("register");
    console.log(err);
    return res.status(400).send(err).json({
      success: false,
      message: "Error occurred at register",
    });
  }
};

export const login = async (req, res) => {
  const {
    body: { userID, password },
  } = req;
  try {
    const userState = await User.findOne({
      attributes: ["id", "userID", "userEmail", "userPassword"],
      where: {
        userID,
      },
    });
    if (!userState) {
      return res.status(200).json({
        success: false,
        message: "Auth failed, email is not found",
      });
    } else {
      const { dataValues: user } = userState;
      if (user.userPassword !== password) {
        return res
          .status(200)
          .json({ success: false, message: "Wrong password" });
      } else {
        var token = jwt.sign(user.id, process.env.SALT).substr(3, 20);
        var tokenExp = moment().add(0.5, "hour").valueOf();
        User.update(
          {
            token,
            tokenExp,
          },
          {
            where: { id: user.id },
          }
        );
        res.cookie("w_authExp", tokenExp);
        if (!user.emailChecked) {
          return res.status(200).cookie("w_auth", token).json({
            success: true,
            emailChecked: false,
            userId: user.id,
            message: "Email unchecked account.",
          });
        } else {
          return res.cookie("w_auth", token).status(200).json({
            success: true,
            emailChecked: true,
            userId: user.id,
          });
        }
      }
    }
  } catch (err) {
    console.log("login");
    console.log(err);
    return res.status(400).send(err).json({
      success: false,
      message: "Error occurred at login",
    });
  }
};

export const checkEmail = async (req, res) => {
  const {
    user: { userID: id },
    body: { emailHash },
  } = req;
  try {
    const { dataValues: user } = await User.findOne({
      attributes: ["userID", "userEmail", "userPassword", "emailHash"],
      where: {
        id,
      },
    });
    if (emailHash == user.emailHash) {
      User.update(
        {
          emailChecked: true,
          emailHash: null,
        },
        {
          where: { id },
        }
      );
      return res.status(200).json({
        success: true,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Wrong emailHash!",
      });
    }
  } catch (err) {
    console.log("checkEmail");
    console.log(err);
    return res
      .status(400)
      .send(err)
      .json({ success: false, message: "Error occurred at checkEmail" });
  }
};

export const logout = (req, res) => {
  const {
    user: { id },
  } = req;
  try {
    User.update(
      {
        token: null,
        tokenExp: null,
      },
      {
        where: { id },
      }
    );
    return res.status(200).send({
      success: true,
    });
  } catch (err) {
    console.log("logout");
    console.log(err);
    return res
      .status(400)
      .send(err)
      .json({ success: false, message: "Error occurred at logout" });
  }
};

export const addCart = async (req, res) => {
  const {
    body: { productId },
    user: { id: producter },
  } = req;

  try {
    console.log(productId, producter);
    const findProduct = await Product.findOne({
      where: parseInt(productId, 10),
    });

    findProduct.addUserCart(producter);
    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    return res
      .status(401)
      .send(error)
      .json({ success: false, message: "존재하지 않은 상품입니다." });
  }
};
export const removeCart = async (req, res) => {
  const {
    body: { productId },
    user: { id: producter },
  } = req;

  try {
    console.log(productId, producter);
    const findProduct = await Product.findOne({
      where: parseInt(productId, 10),
    });

    findProduct.removeUserCart(producter);
    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    return res
      .status(401)
      .send(error)
      .json({ success: false, message: "존재하지 않은 상품입니다." });
  }
};

export const addWishList = async (req, res) => {
  const {
    body: { productId },
    user: { id: producter },
  } = req;

  try {
    console.log(productId, producter);
    const findProduct = await Product.findOne({
      where: parseInt(productId, 10),
    });

    findProduct.addWishList(producter);
    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    return res
      .status(401)
      .send(error)
      .json({ success: false, message: "존재하지 않은 상품입니다." });
  }
};

export const removeWishList = async (req, res) => {
  const {
    body: { productId },
    user: { id: producter },
  } = req;

  try {
    console.log(productId, producter);
    const findProduct = await Product.findOne({
      where: parseInt(productId, 10),
    });

    findProduct.removeWishList(producter);
    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    return res
      .status(401)
      .send(error)
      .json({ success: false, message: "존재하지 않은 상품입니다." });
  }
};
