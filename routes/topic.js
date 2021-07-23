var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var sanitizeHTML = require('sanitize-html')
var template = require('../lib/template.js')

router.get('/create', function(request, response){
    var title = 'WEB - CREATE';
    var list = template.list(request.list);
    var html = template.html(title, list, `
      <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" placeholder="description"></textarea></p>
        <p><input type="submit"></p>
      </form>`, '');
    response.send(html);
});

router.post('/create_process', function(request, response){
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    response.redirect(`/topic/${title}`);
  })
});

router.get('/update/:pageId', function(request, response){
     var filteredId = path.parse(request.params.pageId).base;
     fs.readFile(`data/${filteredId}`, 'utf8', function(err,description){
       var title = request.params.pageId;
       var list = template.list(request.list);
       var html = template.html(title, list, `
         <form action="/topic/update_process" method="post">
           <input type="hidden" name="id" value="${title}">
           <p><input type="text" name="title" placeholder="title" value="${title}"></p>
           <p><textarea name="description" placeholder="description">${description}</textarea></p>
           <p><input type="submit"></p>
         </form>`,
         `<a href="/topic/create">CREATE</a> <a href="/topic/update/${title}">UPDATE</a>`
       );
       response.send(html);
  });
});

router.post('/update_process', function(request, response){
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(`/topic/${title}`);
      })
    });

});

router.post('/delete_process', function(request, response){
 var post = request.body;
 var id = post.id;
 var filteredId = path.parse(id).base;
 fs.unlink(`data/${filteredId}`, function(error){
   response.redirect('/');
 });
});

router.get('/:pageId', function(request,response, next){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err,description){
      if(err){
        next(err);
      }
      else{
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHTML(title);
        var sanitizedDescription = sanitizeHTML(description);
        var list = template.list(request.list);
        var html = template.html(title, list, `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
          `<a href="/topic/create">CREATE</a>
          <a href="/topic/update/${sanitizedTitle}">UPDATE</a>
          <form action="/topic/delete_process" method="post">
          <input type="hidden"  name="id" value="${sanitizedTitle}">
          <input type="submit" value="DELETE">
          </form>
          `);
          response.send(html);
        }
    });
});

module.exports = router;
