#! python

import cgi
form = cgi.FieldStorage()
title = form.getvalue("title")
description = form.getvalue("description")

opened_file = open('data/'+title, 'w')
opened_file.write(description)

# Redirection
print("Location: index.py?id="+title)
print()
