<?php
require_once('./info/mysql.php');
require_once('./header/post-json.php');

$queryString = "SELECT * FROM food JOIN restaurant ON food.restaurant=restaurant.restaurant";

/** 查询结果 */
$searchResult = $mysqli->query($queryString);

$arr = array();

while ($row = mysqli_fetch_array($searchResult)) {
  array_push($arr, array(
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
echo json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$searchResult->free();
$mysqli->close();