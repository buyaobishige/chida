<?php
require_once('./info/mysql.php');
require_once('./header/post-json.php');

// 获得传递数据
$postData = json_decode(file_get_contents('php://input'));

$type = $postData->type;

if ($type === 'get') {
  $restaurant = $postData->restaurant;

  // $foodList = $mysqli->query("SELECT * FROM restaurant WHERE restaurant.restaurant='$restaurant' RIGHT JOIN food ON food.restaurant=restaurant.restaurant");
  $foodList = $mysqli->query("SELECT * FROM `restaurant` JOIN `food` ON food.restaurant=restaurant.restaurant WHERE food.restaurant='$restaurant'");
  $restaurantInfo = $mysqli->query("SELECT * FROM `restaurant` WHERE restaurant.restaurant='$restaurant'");
  $addviews = $mysqli->query("UPDATE restaurant SET views=views+1 WHERE restaurant='$restaurant'");
  // 食物列表 map
  $listMap = array();

  while ($row = mysqli_fetch_array($foodList)) {
    if (!$listMap[$row['classification']]) $listMap[$row['classification']] = array();

    array_push($listMap[$row['classification']], array(
      "food" => $row["food"],
      "des" => $row["des"],
      "src" => $row["src"],
      "price" => floatval($row["price"])
    ));
  }

  // 将 map 转换为数组
  $output = array();

  foreach ($listMap as $key => $value)
    array_push($output, array(
      "name" => $key,
      "content" => $value
    ));

  $info = mysqli_fetch_array($restaurantInfo);

  $result = array(
    "info" => array(
      "name" => $info["restaurant"],
      "des" => $info["des"],
      "src" => $info["src"],
      "locale" => $info['locate'],
      "contact" => $info['contact'],
      "tags" => json_decode($info["tags"]),
      "views" => intval($info['views']),
      "rate" => $info['rate'],
    ),
    'foodList' => $output
  );

  echo json_encode($result, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

$mysqli->close();
