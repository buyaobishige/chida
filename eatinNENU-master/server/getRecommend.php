<?php
require_once('./info/mysql.php');
require_once('./header/post-json.php');

$queryString = "SELECT * FROM stall RIGHT JOIN food On food.stall=stall.stall WHERE food.is_recommended=1";

$result = $mysqli->query($queryString);

$arr = array();

while ($row = mysqli_fetch_array($result)) {
  array_push($arr, array(
    "id" => $row["id"],
    "name" => $row["name"],
    "desc" => $row["description"],
    "src" => $row["src"],
    "locate" => $row["locate"],
    "stall" => $row["stall"],
    "tags" => json_decode($row["tags"]),
    "score" => floatval($row["score"]),
    "price" => floatval($row["price"]),
  ));
}

echo json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$result->free();
$mysqli->close();
