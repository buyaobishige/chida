<?php
require_once('./info/mysql.php');
require_once('./header/post-json.php');

$queryString = "SELECT * FROM restaurant JOIN food ON food.restaurant=restaurant.restaurant";

/** 查询结果 */
$searchResult = $mysqli->query($queryString);

$arr = array();

while ($row = mysqli_fetch_array($searchResult)) {
  array_push($arr, array(
    "name" => $row["food"],
    "locate" => $row["locate"],
    "id" => $row["fid"],
    "stall" => $row["restaurant"],
    "tags" => json_decode($row["tag"]),
    "score" => floatval($row["score"]),
    "desc" => $row["description"],
    "price" => floatval($row["price"]),
    "src" => $row["src"]
  ));
}
echo json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$searchResult->free();
$mysqli->close();
