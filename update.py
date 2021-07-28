#! python
print("Content-Type: text/html\n")
import cgi, os, view

form = cgi.FieldStorage()
if 'id' in form:
    pageId = form.getvalue("id")
    description = open('data/'+pageId, 'r', encoding="UTF8").read()
else:
    pageId='Welcome'
    description = 'Hello, WEB'
print('''
<!doctype html>
<html>
<head>
  <title>WEB1 - Welcome</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="index.py">WEB</a></h1>
  <ol>
    {list}
  </ol>
  <a href="create.py">create</a>
  <form action="update_process.py" method="post">
    <input type="hidden" name="pageId" value="{default_title}">
      <p><input type="text" name="title" placeholder="title" value="{default_title}"></p>
      <p><textarea rows="4" name="description" placeholder="description">{default_desc}</textarea></p>
      <p><input type="submit"></p>
  </form>
</body>
</html>
'''.format(title=pageId, desc=description, list=view.getList(), default_title=pageId, default_desc=description))
