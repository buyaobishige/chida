<?php
require_once('./info/mysql.php');
require_once('./header/post-json.php');


$result = $mysqli->query("SELECT * FROM food JOIN restaurant On food.restaurant=restaurant.restaurant WHERE food.is_recommended=1");
// $result = $mysqli->query("SELECT * FROM food WHERE is_recommended=1");
$arr2 = array();
while ($row = mysqli_fetch_array($result)) {
  array_push($arr2, array(
    "food" => $row["food"],
    "locate" => $row["locate"],
    "fid" => $row["fid"],
    "restaurant" => $row["restaurant"],
    "tag" => json_decode($row["tag"]),
    "score" => floatval($row["score"]),
    "description" => $row["description"],
    "price" => floatval($row["price"]),
    "src" => $row["src"]  
  ));
}

echo json_encode($arr2, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$result->free();
$mysqli->close();