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

// 检测连接
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
$openid=$_GET['openid'];

// $restaurantName = "妈妈亲饺子馆";
$result = mysqli_query($conn, "SELECT * FROM favorite WHERE openid='$openid'");
$arr = array();
while ($row = mysqli_fetch_array($result)) {
  array_push($arr, array(
    "name" => $row["name"],
    "locate" => $row["locate"],
    "date" => $row["date"],
    "obj_id" => $row["obj_id"],
    "category" => $row["category"],
    "src" => $row["src"],
    "restaurant" => $row["restaurant"]
  ));
}
echo json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
