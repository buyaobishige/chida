<?php
require_once('../info/mysql.php');
require_once('../header/post-json.php');

$market = $_GET['market'];
$queryString = "SELECT * FROM fruit WHERE market='$market' ORDER BY timeStamp DESC";

/** 查询结果 */
$searchResult = $mysqli->query($queryString);

$arr = array();

while ($row = mysqli_fetch_array($searchResult)) {
  array_push($arr, array(
    "market" => $row["market"],
    "databaseSet" => $row["databaseSet"],
    "timeStamp" => $row["timeStamp"],
  ));
}
echo json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$searchResult->free();
$mysqli->close();
