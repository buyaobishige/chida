<?php
require_once('../info/mysql.php');
require_once('../header/post-json.php');
$orientation = $_GET['orientation'];

// $result = $mysqli->query("SELECT * FROM remarks WHERE remarks.orientation='$orientation' ORDER BY date desc");
$result = $mysqli->query("SELECT * FROM remarks LEFT JOIN replys ON remarks.id=replys.rid WHERE remarks.orientation='$orientation' ORDER BY remarks.date desc");

// WHERE remarks.orientation='$orientation' ORDER BY remarks.date desc  
$arr = array();
while ($row = mysqli_fetch_array($result)) {
  array_push($arr, array(
    "id" => $row["id"],
    "user" => $row["user"],
    "openid" => $row["openid"],
    "avatarUrl" => $row["avatarUrl"],
    "content" => $row["content"],
    "date" => $row["date"],
    "rate" => $row["rate"],
    "zan_list" => $row["zan_list"],
    "special" => $row["special"],
    "systemModel" => $row["systemModel"],
    "replyNumber" => 0,
    "replys" => array(
      "replyid" => $row["replyid"],
      "rid" => $row["rid"],
      "ruser" => $row["ruser"],
      "ropenid" => $row["ropenid"],
      "ravatarUrl" => $row["ravatarUrl"],
      "rcontent" => $row["rcontent"],
      "rdate" => $row["rdate"],
      "rzan_list" => $row["rzan_list"],
      "rspecial" => $row["rspecial"],
      "rsystemModel" => $row["rsystemModel"]
    )
  ));
}
if (sizeof($arr) > 0) {
  $result1 = $mysqli->query("SELECT rate FROM restaurant WHERE restaurant='$orientation'");
  while ($row = mysqli_fetch_array($result1)) {
    $arr[0]["rate"] = $row['rate'];
  }
}
echo json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
