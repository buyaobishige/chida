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


// $restaurantName = $_GET['restaurantName'];
$result = mysqli_query($conn, "SELECT * FROM cards");
$arr = array();
while ($row = mysqli_fetch_array($result)) {
  array_push($arr, array(
    "name" => $row["name"],
    "restaurant" => $row["restaurant"],
    "number" => $row["number"],
    "bg" => $row["bg"],
    "src" => $row["src"],
    "obj_id" => $row["obj_id"],
    "locate" => $row["locate"],
    "description" => $row["description"],
  ));
}
echo json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
