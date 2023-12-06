import User from '../models/user.model.js';
import Article from '../models/article.model.js';


export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .sort({ age: 1 })
      .select({ fullName: 1, email: 1, age: 1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export const getUserByIdWithArticles = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    const articles = await Article.find({ owner: userId })
      .select({ title: 1, subtitle: 1, createdAt: 1, _id: 0 });
    res.json({
      user: user,
      relatedArticles: articles
    });
  } catch (err) {
    next(err);
  }
}

export const createUser = async (req, res, next) => {
  try {
    const createdUser = await User.create(req.body);
    res.json(createdUser);
  } catch (err) {
    next(err);
  }
}

export const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, age } = req.body;
    const updateResult = await User.updateOne(
      { _id: userId },
      { $set: { firstName: firstName, lastName: lastName, age: age } }
    );
    res.json(updateResult);
  } catch (err) {
    next(err);
  }
}

export const deleteUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    let deletedArticles = null;
    if (deletedUser) {
      deletedArticles = await Article.deleteMany({ owner: userId });
    }
    res.json({
      userDeletion: deletedUser,
      articlesDeletion: deletedArticles
    })
  } catch (err) {
    next(err);
  }
}

