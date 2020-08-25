<?php
$servername = "localhost:3306";
$username = "lin";
$password = "iwRCypes7n6rWKG3";
$dbname = "lin";
// 创建连接
$mysqli = new mysqli($servername, $username, $password, $dbname);

// 检测连接
if ($mysqli->connect_errno) {
  echo "Error" . $mysqli->connect_errno . " Failed to connect to MySQL: " . $mysqli->connect_error;
}
