<?php
require_once('./info/mysql.php');
require_once('./header/post-json.php');
$result = $mysqli->query("SELECT * FROM restaurant");


$arr = array();

while ($row = mysqli_fetch_array($result)) {

  array_push($arr, array(
    "name" => $row["restaurant"],
    "locate" => $row["locate"],
    "src" => $row["src"],
    "des" => $row["des"],
    "rate" => $row["rate"],

  ));
}
echo json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
