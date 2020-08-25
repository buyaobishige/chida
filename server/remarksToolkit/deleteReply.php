<?php
require_once('../info/mysql.php');
require_once('../header/post-json.php');
$replyid = $_GET['replyid'];


if ($result = $mysqli->query("DELETE FROM replys WHERE replyid = '$replyid' ") === TRUE) {
  echo "已删除";
} else {
  echo "Error: " . $sql . "<br>" . $mysqli->error;
}

