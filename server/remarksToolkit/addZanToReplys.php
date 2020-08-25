<?php
require_once('../info/mysql.php');
require_once('../header/post-json.php');

$ropenid = $_GET["ropenid"];
$replyid = $_GET["replyid"];
$result = $mysqli->query("SELECT rzan_list FROM replys WHERE replyid='$replyid'");
while ($row = mysqli_fetch_array($result)) {
  $rzan_list = $row["rzan_list"];
}

echo $rzan_list;
if (empty($rzan_list)) {
  echo "null";
  $zan00 = json_encode(array($ropenid));
  $result2 = $mysqli->query("UPDATE replys set rzan_list='$zan00' WHERE replyid='$replyid'");
} else {
  $zan = json_decode($rzan_list);
  if (in_array($ropenid, $zan) == true) {
    echo "\n" . "cancel";
    foreach ($zan as $key => $item) {
      if ($item == $ropenid) {
        array_splice($zan, $key, 1);
      }
    }
    $zan11 = json_encode($zan, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    echo "\n" . $zan11;
    $result3 = $mysqli->query("UPDATE replys set rzan_list='$zan11' WHERE replyid='$replyid'");
  } else if (in_array($ropenid, $zan) == false) {
    echo ("isarray");
    array_push($zan, $ropenid);
    $zan22 = json_encode($zan, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $result4 = $mysqli->query("UPDATE replys set rzan_list='$zan22' WHERE replyid='$replyid'");
  }
}


$mysqli->close();
