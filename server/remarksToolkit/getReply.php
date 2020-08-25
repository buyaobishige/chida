<?php
require_once('../info/mysql.php');
require_once('../header/post-json.php');
$id = $_GET['id'];

// $result = $mysqli->query("SELECT * FROM remarks WHERE remarks.orientation='$orientation' ORDER BY date desc");
$result = $mysqli->query("SELECT DISTINCT * FROM replys JOIN remarks ON remarks.id=replys.rid WHERE remarks.id='$id' ORDER BY rdate desc");

// WHERE remarks.orientation='$orientation' ORDER BY remarks.date desc  
$arr = array();
$arr2 = array();
while ($row = mysqli_fetch_array($result)) {
  array_push($arr, array(
    "id" => $row["id"],
    "user" => $row["user"],
    "openid" => $row["openid"],
    "avatarUrl" => $row["avatarUrl"],
    "content" => $row["content"],
    "date" => $row["date"],
    "zan_list" => $row["zan_list"],
    "special" => $row["special"],
    "systemModel" => $row["systemModel"],
    "replyNumber" => 0,
  ));
  array_push($arr2, array(
    "replyid" => $row["rireplyidd"],
    "rid" => $row["rid"],
    "ruser" => $row["ruser"],
    "ropenid" => $row["ropenid"],
    "ravatarUrl" => $row["ravatarUrl"],
    "rcontent" => $row["rcontent"],
    "rdate" => $row["rdate"],
    "rzan_list" => $row["rzan_list"],
    "rspecial" => $row["rspecial"],
    "rsystemModel" => $row["rsystemModel"]
  ));
}
$arr3 = array($arr, $arr2);
echo json_encode($arr3, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
