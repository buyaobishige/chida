<?php
header("Content-Type: text/json; charset=utf-8");
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:POST');
header('Access-Control-Allow-Headers:x-requested-with,content-type');

$filename = "./charData.txt";
$handle = fopen($filename, "r");
$contents = fread($handle, filesize($filename));
$arr = json_decode($contents);

$char = $_GET["char"];
$mode = $_GET["mode"];

$i = 0;
$msg = "无重复。辛苦啦~";
while ($i < sizeof($arr)) {
  if ($char == $arr[$i]->{"char"}) {
    $msg = "这个字已经发过啦！换一个吧。";
  }
  $i++;
}
if ($mode == 1) {
  if ($msg != "这个字已经发过啦！换一个吧。") {
    array_push($arr, array("char" => $char, "date" => time()));
    fclose($handle);
    $handle2 = fopen($filename, "w");
    $arrString = json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    fwrite($handle2, $arrString);
  }
  echo $msg;
} elseif ($mode == 0) {
  echo sizeof($arr);
}
