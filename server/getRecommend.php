<?php
require_once('./info/mysql.php');
require_once('./header/post-json.php');


$result = $mysqli->query("SELECT * FROM restaurant JOIN food On food.restaurant=restaurant.restaurant WHERE food.is_recommended=1");
// $result = $mysqli->query("SELECT * FROM food WHERE is_recommended=1");
$arr2 = array();
while ($row = mysqli_fetch_array($result)) {
  array_push($arr2, array(
    "id" => $row["fid"],
    "name" => $row["food"],
    "desc" => $row["description"],
    "src" => $row["src"],  
    "locate" => $row["locate"],
    "stall" => $row["restaurant"],
    "tags" => json_decode($row["tag"]),
    "score" => floatval($row["score"]),
    "price" => floatval($row["price"]),
  ));
}

echo json_encode($arr2, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$result->free();
$mysqli->close();