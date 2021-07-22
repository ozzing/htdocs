const express = require('express')
const app = express()
const port = 3000
var fs = require('fs')
var template = require('./lib/template.js')
var path = require('path')
var sanitizeHTML = require('sanitize-html')
var qs = require('querystring')
var bodyParser = require('body-parser')
var compression = require('compression')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

app.get('/', function(request,response,next){
    var title = 'Welcome!';
    var description = "Hello, Node.js!";
    var list = template.list(request.list);
    var html = template.html(title, list, `<h2>${title}</h2>${description}
      <img src="/images/coding.jpg" style="width:400px; display:block; margin-top:20px;">`,
      `<a href="/create">CREATE</a>`);
      response.send(html);
});

app.get('/page/:pageId', function(request,response, next){
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
          `<a href="/create">CREATE</a>
          <a href="/update/${sanitizedTitle}">UPDATE</a>
          <form action="/delete_process" method="post">
          <input type="hidden"  name="id" value="${sanitizedTitle}">
          <input type="submit" value="DELETE">
          </form>
          `);
          response.send(html);
        }
    });
});

app.get('/create', function(request, response){
    var title = 'WEB - CREATE';
    var list = template.list(request.list);
    var html = template.html(title, list, `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" placeholder="description"></textarea></p>
        <p><input type="submit"></p>
      </form>`, '');
    response.send(html);
});

app.post('/create_process', function(request, response){
  // var body = '';
  //   request.on('data', function(data){
  //       body = body + data;
  //   });
  //   request.on('end', function(){
  //       var post = qs.parse(body);
  //       var title = post.title;
  //       var description = post.description;
  //       fs.writeFile(`data/${title}`, description, 'utf8', function(err){
  //         response.writeHead(302, {Location: `/page/${title}`});
  //         response.end();
  //       })
  //  });
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    response.writeHead(302, {Location: `/page/${title}`});
    response.end();
  })
});

app.get('/update/:pageId', function(request, response){
     var filteredId = path.parse(request.params.pageId).base;
     fs.readFile(`data/${filteredId}`, 'utf8', function(err,description){
       var title = request.params.pageId;
       var list = template.list(request.list);
       var html = template.html(title, list, `
         <form action="/update_process" method="post">
           <input type="hidden" name="id" value="${title}">
           <p><input type="text" name="title" placeholder="title" value="${title}"></p>
           <p><textarea name="description" placeholder="description">${description}</textarea></p>
           <p><input type="submit"></p>
         </form>`,
         `<a href="/create">CREATE</a> <a href="/update?id=${title}">UPDATE</a>`
       );
       response.send(html);
  });
});

app.post('/update_process', function(request, response){
   //  var body = '';
   //  request.on('data', function(data){
   //      body = body + data;
   //  });
   //  request.on('end', function(){
   //      var post = qs.parse(body);
   //      var id = post.id;
   //      var title = post.title;
   //      var description = post.description;
   //      fs.rename(`data/${id}`, `data/${title}`, function(error){
   //        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
   //          response.redirect(`/page/${title}`);
   //        })
   //      });
   // });
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(`/page/${title}`);
      })
    });

});

app.post('/delete_process', function(request, response){
  // var body = '';
  //      request.on('data', function(data){
  //          body = body + data;
  //      });
  //      request.on('end', function(){
  //          var post = qs.parse(body);
  //          var id = post.id;
  //          var filteredId = path.parse(id).base;
  //          fs.unlink(`data/${filteredId}`, function(error){
  //            response.redirect('/');
  //          });
  //     });
 var post = request.body;
 var id = post.id;
 var filteredId = path.parse(id).base;
 fs.unlink(`data/${filteredId}`, function(error){
   response.redirect('/');
 });
});

app.use(function(req, res, next){
  res.status(404).send('SORRY NO SUCH PAGE');
});

app.use(function(err,req,res,next){
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(port, function(){
  console.log(`Example app listening on port ${port}`);
});
