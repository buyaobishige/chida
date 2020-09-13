<?php
require_once('./info/mysql.php');
require_once('./header/post-json.php');

$openid = $_GET["openid"];
$arr = array();
$result = $mysqli->query("SELECT * FROM user WHERE openid='$openid'");
/** 用户首次创建时 */
if (mysqli_num_rows($result) < 1) {
  if ($mysqli->query("INSERT INTO user (openid,likes,dislikes) VALUES ('$openid', '[]','[]')") === TRUE) {
    $arr =
      array(array(
        "likes" => "[]",
        "dislikes" => "[]"
      ));
  }
} else {
  while ($row = mysqli_fetch_array($result)) {
    array_push($arr, array(
      "likes" => $row["likes"],
      "dislikes" => $row["dislikes"]
    ));
  }
}
echo json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$result->free();
$mysqli->close();
