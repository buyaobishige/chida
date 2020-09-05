<?php
require_once('./info/mysql.php');
require_once('./header/post-json.php');

$openid = $_GET["openid"];
$likes = $_GET["likes"];
$dislikes = $_GET["dislikes"];
// $result = $mysqli->query("SELECT * FROM user WHERE openid='$openid'");
if ($mysqli->query("UPDATE user SET likes='$likes',dislikes='$dislikes' WHERE openid='$openid'") === TRUE) {
  echo "数据更新成功";
}


$result->free();
$mysqli->close();
