<?php
require_once('./info/qq-appid.php');
require_once('./lib/curl.php');

// 获得传递数据
$postData = json_decode(file_get_contents('php://input'));

$jsCode = $postData->code;

$response = curlGet("https://api.q.qq.com/sns/jscode2session?appid=$appid&secret=$secret&js_code=$jsCode&grant_type=authorization_code");

$result = json_decode($response, true);
echo (json_encode($result['openid']));
