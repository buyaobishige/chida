<?php
require_once('../info/mysql.php');
require_once('../header/post-json.php');

$user = $_GET["user"];
$systemModel = $_GET["systemModel"];
$openid = $_GET["openid"];
$avatarUrl = $_GET["avatarUrl"];
$content = $_GET["content"];
$orientation = $_GET["orientation"];
$rate = $_GET["rate"];
$date = time();


if ($mysqli->query("INSERT INTO remarks (user,openid,systemModel, content,date,orientation,avatarUrl) VALUES ('$user','$openid', '$systemModel','$content','$date','$orientation','$avatarUrl')") === TRUE) {
  echo "新记录插入成功";
} else {
  echo "Error: " . $sql . "<br>" . $mysqli->error;
}
if ($mysqli->query("UPDATE restaurant SET rate='$rate' WHERE restaurant='$orientation'") === TRUE) {
  echo "评分更新成功";
} else {
  echo "Error: " . $sql . "<br>" . $mysqli->error;
}

$mysqli->close();
