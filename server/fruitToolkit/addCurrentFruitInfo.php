<?php
require_once('../info/mysql.php');
require_once('../header/post-json.php');

$market = $_GET['market'];
$timeStamp = $_GET['timeStamp'];
$databaseSet = $_GET['databaseSet'];

if (
  $mysqli->query("INSERT INTO fruit (market,timeStamp,databaseSet) VALUES ('$market','$timeStamp', '$databaseSet')") === TRUE
) {
  echo "新记录插入成功";
} else {
  echo "Error: " . $sql . "<br>" . $mysqli->error;
}

$mysqli->close();
