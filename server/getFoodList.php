<?php
require_once('./info/mysql.php');
require_once('./header/post-json.php');

$queryString = "SELECT * FROM stall RIGHT JOIN food ON food.stall=stall.stall";
// $queryString = "SELECT * FROM stall RIGHT JOIN food ON food.stall=stall.stall ORDER BY id ASC";

/** 查询结果 */
$searchResult = $mysqli->query($queryString);

$arr = array();
while ($row = mysqli_fetch_array($searchResult)) {
  $tags = json_decode($row["tags"]);
  array_push($arr, array(
    "id" => $row["id"],
    "name" => $row["name"],
    "desc" => $row["description"],
    "src" => $row["src"],
    "locate" => $row["locate"],
    "stall" => $row["stall"],
    "tags" => $tags === NULL ? array() : $tags,
    "score" => floatval($row["score"]),
    "price" => floatval($row["price"]),
  ));
}
echo json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$searchResult->free();
$mysqli->close();
