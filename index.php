<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <h1><a href="index.php">WEB</h1>
    <ol>
      <li><a href="index.php?id=HTML">HTML</a></li>
      <li><a href="index.php?id=CSS">CSS</a></li>
      <li><a href="index.php?id=JavaScript">JavaScript</a></li>
    </ol>
    <h2>
      <?php
        if(!isset($_GET['id'])){
          echo "WELCOME!!!";
        }
        else {
          echo $_GET['id'];
        }
      ?>
    </h2>
      <?php
      if(!isset($_GET['id'])){
        echo "Hi, PHP";
      }
      else {
        echo file_get_contents("data/".$_GET['id']);
      }
      ?>
  </body>
</html>
