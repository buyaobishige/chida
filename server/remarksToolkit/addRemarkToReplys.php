<?php
require_once('../info/mysql.php');
require_once('../header/post-json.php');

$rat = $_GET["rat"];
$rid = $_GET["rid"];
$ruser = $_GET["ruser"];
$rsystemModel = $_GET["rsystemModel"];
$ropenid = $_GET["ropenid"];
$ravatarUrl = $_GET["ravatarUrl"];
$rcontent = $_GET["rcontent"];
$rorientation = $_GET["rorientation"];
$rdate = time();


if ($mysqli->query("INSERT INTO replys (rat,rid,ruser,ropenid,rsystemModel, rcontent,rdate,rorientation,ravatarUrl) VALUES ('$rat','$rid','$ruser','$ropenid', '$rsystemModel','$rcontent','$rdate','$rorientation','$ravatarUrl')") === TRUE) {
  echo "新记录插入成功";
} else {
  echo "Error: " . $sql . "<br>" . $mysqli->error;
}


$mysqli->close();
