<?php
require_once('../info/mysql.php');
require_once('../header/post-json.php');

$openid = $_GET["openid"];
$id = $_GET["id"];
$result = $mysqli->query("SELECT zan_list FROM remarks WHERE id='$id'");
while ($row = mysqli_fetch_array($result)) {
  $zan_list = $row["zan_list"];
}

echo $zan_list;
if (empty($zan_list)) {
  echo "null";
  $zan00 = json_encode(array($openid));
  $result2 = $mysqli->query("UPDATE remarks set zan_list='$zan00' WHERE id='$id'");
} else {
  $zan = json_decode($zan_list);
  if (in_array($openid, $zan) == true) {
    echo "\n" . "cancel";
    foreach ($zan as $key => $item) {
      if ($item == $openid) {
        array_splice($zan, $key, 1);
      }
    }
    $zan11 = json_encode($zan, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    echo "\n" . $zan11;
    $result3 = $mysqli->query("UPDATE remarks set zan_list='$zan11' WHERE id='$id'");
  } else if (in_array($openid, $zan) == false) {
    echo ("isarray");
    array_push($zan, $openid);
    $zan22 = json_encode($zan, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $result4 = $mysqli->query("UPDATE remarks set zan_list='$zan22' WHERE id='$id'");
  }
}
//

//   array_push($zan,$openid);
//   $zan1 = json_encode($zan);
//   $result2 = $mysqli->query("UPDATE remarks set zan_list='$zan1' WHERE id='$id'");
// }
//  if (in_array($openid, $zan_list)) {
//   echo "existed";
//   foreach ($zan as $key => $item) {
//     if ($item == $openid) {
//       array_splice($zan, $key, 1);
//     };
//   }
//   $zan1 = json_encode($zan);
//   echo $zan1;

$mysqli->close();
