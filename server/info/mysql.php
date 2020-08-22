<?php
$servername = "localhost:3306";
$username = "nenu";
$password = "RLs864CBe8pdM3jt";
$dbname = "nenu";
// 创建连接
$mysqli = new mysqli($servername, $username, $password, $dbname);

// 检测连接
if ($mysqli->connect_errno) {
  echo "Error" . $mysqli->connect_errno . " Failed to connect to MySQL: " . $mysqli->connect_error;
}
