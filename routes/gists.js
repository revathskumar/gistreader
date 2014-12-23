var express = require('express');
var router  = express.Router();
var parseMarkdown = require('marked');
var github = require('octonode');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/:id', function(req, res, next){
  var client = github.client();
  var gistApi = client.gist();

  gistApi.get(req.params.id, function(err, gist){
    if(err) {
      next(new Error('failed to load gist'));
      return;
    }
    var htmlContents = {};
    Object.keys(gist['files']).forEach(function(filename) {
      if (gist['files'][filename]['language'] == 'Markdown') {
        htmlContents[filename] = parseMarkdown(gist['files'][filename]['content']);
      }
    });
    res.render('show', {htmlContents: htmlContents});
  });

});

module.exports = router;
