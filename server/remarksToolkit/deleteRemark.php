<?php
require_once('../info/mysql.php');
require_once('../header/post-json.php');
$id = $_GET['id'];
$rate = $_GET["rate"];

// $result = $mysqli->query("SELECT * FROM remarks WHERE remarks.orientation='$orientation' ORDER BY date desc");

if ($result = $mysqli->query("DELETE FROM remarks WHERE id = '$id' ") === TRUE) {
  echo "已删除";
} else {
  echo "Error: " . $sql . "<br>" . $mysqli->error;
}
if ($mysqli->query("UPDATE restaurant SET rate='$rate' WHERE restaurant='$orientation'") === TRUE) {
  echo "评分更新成功";
} else {
  echo "Error: " . $sql . "<br>" . $mysqli->error;
}
