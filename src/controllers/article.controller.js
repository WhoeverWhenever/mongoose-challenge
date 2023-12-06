import Article from '../models/article.model.js';
import { validateArticleChanges } from '../validators/article.validator.js';

export const getArticles = async (req, res, next) => {
  try {
    const { title, page, limit = 5 } = req.query;
    const articles = await Article.find(
      { title: title },
      null,
      {
        limit: limit,
        skip: (page - 1) * limit
      }
    ).populate(
      {
        path: "owner",
        select: "fullName email age -_id"
      }
    ).lean();
    res.json({
      page: page,
      articles: articles
    });
  } catch (err) {
    next(err);
  }
}

// It is not mentioned in the task
export const getArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);
    res.json(article);
  } catch (err) {
    next(err);
  }
}

export const createArticle = async (req, res, next) => {
  try {
    const article = new Article(req.body);
    const author = article.owner._id;
    if (author == null) {
      let newArticle = await Article.create(article);
      newArticle = await newArticle.populate("owner");
      newArticle.owner.numberOfArticles += 1;
      await newArticle.owner.save();
      res.json(newArticle);
    }
    else {
      res.send("No author!");
    }
  } catch (err) {
    next(err);
  }
}

export const updateArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const articleToUpdate = await Article.findById(articleId);
    const articleOwner = (await articleToUpdate.populate("owner")).owner;
    if (articleToUpdate == null && articleOwner == null) {
      const articleData = validateArticleChanges(req.body);
      const articleUpd = { ...articleToUpdate.toObject(), ...articleData };
      const updatedArticle = await Article.findOneAndReplace(
        { _id: articleId },
        articleUpd,
        { new: true }
      );
      res.json(updatedArticle);
    }
    else {
      res.send("Something wrong");
    }
  } catch (err) {
    next(err);
  }
}

export const deleteArticleById = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId)
      .populate("owner");
    article.owner.numberOfArticles -= 1;
    await article.owner.save();
    article.deleteOne();
    res.json(article);
  } catch (err) {
    next(err);
  }
}
