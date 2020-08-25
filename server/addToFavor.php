<?php
$servername = "localhost:3306";
$username = "lin";
$password = "iwRCypes7n6rWKG3";
$dbname = "lin";

header("Content-Type: text/json; charset=utf-8");
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:POST');
header('Access-Control-Allow-Headers:x-requested-with,content-type');
// 创建连接
$conn = mysqli_connect($servername, $username, $password, $dbname);

$openid = $_GET["openid"];
$name = $_GET["name"];
$obj_id = $_GET["obj_id"];
$category = $_GET["category"];
$locate = $_GET["locate"];
$restaurant = $_GET["restaurant"];
$src = $_GET["src"];
// 检测连接
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
$date = date("Y-m-d");
$sql = "INSERT INTO favorite (name,openid, category,locate,restaurant,src,obj_id,date)
VALUES ('$name','$openid', '$category','$locate','$restaurant','$src','$obj_id','$date')";

if ($conn->query($sql) === TRUE) {
  echo "新记录插入成功";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
