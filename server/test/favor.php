<?php
require_once('./info/mysql.php');

require_once('./header/post-json.php');

// 获得传递数据
$postData = json_decode(file_get_contents('php://input'));

if ($postData->type === 'add') { // 添加
  $insertString = "INSERT INTO `favor` (`openid`, `foodID`) VALUES ('$postData->openid', $postData->id)";

  if ($mysqli->query($insertString) === TRUE) {
    echo 'true';
  } else {
    $mysqli->close();
    echo 'false';
  }
} else if ($postData->type === 'get') { // 获取
  $queryString = "SELECT * FROM `favor` WHERE openid='$postData->openid'";

  /** 查询结果 */
  $searchResult = $mysqli->query($queryString);

  $result = array();

  while ($row = mysqli_fetch_array($searchResult)) {
    array_push($result, $row["foodID"]);
  }

  echo json_encode($result, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

  $searchResult->free();
} else if ($postData->type === 'update') { // 更新
  $deleteString = "DELETE FROM `favor` WHERE openid='$postData->openid'";

  if ($mysqli->query($deleteString) === TRUE) {
    foreach ($postData->data as $value) {
      $insertString = "INSERT INTO `favor` (`openid`, `foodID`) VALUES ('$postData->openid', $value)";

      if ($mysqli->query($insertString) === TRUE) {
        continue;
      } else {
        exit('false');
      }
    }

    echo 'true';
  } else {
    echo 'false';
  }
} else if ($postData->type === 'delete') { // 删除
  $deleteString = "DELETE FROM `favor` WHERE openid='$postData->openid' AND foodID='$postData->id'";

  if ($mysqli->query($deleteString) === TRUE) {
    echo 'true';
  } else {
    echo 'false';
  }
}

$mysqli->close();
