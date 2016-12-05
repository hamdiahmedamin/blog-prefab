'use strict'

// v1.4 added public route (for future auth)

const fileSaver    = require('./../utils/fileSaver');
const Article = require('./../models/articles');

module.exports = (privateRouter, publicRouter) => {
  // articles by page api route
  publicRouter.route('/articles/:page_id/:offset?/:limit?')
  .get((req, res) => {
    Article.find({ page: req.params.page_id })
    .sort({created: -1})
    .skip(parseInt(req.params.offset) ? parseInt(req.params.offset) : 0)
    .limit(parseInt(req.params.limit) ? parseInt(req.params.limit) : 5)
    .exec((err, articles) => {
      if (err) {
        res.json({ success: false, message: err });
        return;
      }
      res.json({ success: true, articles: articles });
    });
  });

  privateRouter.route('/articles/:page_id')
  .post((req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.text = req.body.text;
    article.page = req.params.page_id;
    article.mimetype = req.body.mimetype ? req.body.mimetype : undefined;
    article.media = req.body.media ? req.body.media : undefined;
    article.position = typeof req.body.position === 'number' ? req.body.position : undefined;

    if(req.body.media && req.body.mimetype === 'image') {
      article.mimetype = req.body.media.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
      article.media = fileSaver('media', req.body.media);
    }

    article.save((err, article) => {
      if (err) {
        res.json({ success: false, message: err });
        return;
      }
      res.json({ success: true, article: article });
    });
  });

  // individual media api route
  publicRouter.route('/article/:article_id')
  .get((req, res) => {
    Article.findById(req.params.article_id, (err, article) => {
      if (err) {
        res.json({ success: false, message: err });
        return;
      }
      res.json({ success: true, article: article });
    });
  })

  privateRouter.route('/article/:article_id')
  .put((req, res) => {
    Article.findById(req.params.article_id, (err, article) => {
      if (err) res.send(err);
      article.title = req.body.title ? req.body.title : article.title;
      article.text = req.body.text ? req.body.text : article.text;
      article.page = req.body.page ? req.body.page : article.page;
      article.mimetype = req.body.mimetype ? req.body.mimetype : undefined;
      article.media = req.body.media ? req.body.media : undefined;
      article.position = typeof req.body.position === 'number' ? req.body.position : undefined;
      article.updated = Date.now();

      article.save((err) => {
        if (err) {
          res.json({ success: false, message: err });
          return;
        }
        res.json({ success: true, article: article });
      });
    });
  })

  .delete((req, res) => {
    Article.remove({_id: req.params.article_id}, (err) => {
      if (err) {
        res.json({ success: false, message: err });
        return;
      }
      res.json({ success: true });
    });
  });
}
