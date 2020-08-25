<?php
function curlGet($url)
{
  $curl = curl_init(); // 启动一个CURL会话
  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_HEADER, 0);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // 跳过证书检查
  curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);  // 从证书中检查 SSL 加密算法是否存在
  $tmpInfo = curl_exec($curl);     //返回 api 的 json 对象
  //关闭 URL 请求
  curl_close($curl);
  return $tmpInfo;    //返回 json 对象
}

function curlPost($url, $data)
{
  $ch = curl_init();
  $params[CURLOPT_URL] = $url;    // 请求 url 地址
  $params[CURLOPT_HEADER] = FALSE; // 是否返回响应头信息
  $params[CURLOPT_SSL_VERIFYPEER] = false;
  $params[CURLOPT_SSL_VERIFYHOST] = false;
  $params[CURLOPT_RETURNTRANSFER] = true; // 是否将结果返回
  $params[CURLOPT_POST] = true;
  $params[CURLOPT_POSTFIELDS] = $data;
  curl_setopt_array($ch, $params); // 传入 curl 参数
  $p_rusult = curl_exec($ch); // 执行
  curl_close($ch); // 关闭连接
  return $p_rusult;
}
