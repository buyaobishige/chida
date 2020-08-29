<?php
require_once('./info/mysql.php');
require_once('./header/post-json.php');
$restaurant = $_GET['restaurant'];
// $restaurantName = "妈妈亲饺子馆";

$result2 = $mysqli->query("UPDATE restaurant SET views=views+1 WHERE restaurant='$restaurant'");
$result = $mysqli->query("SELECT * FROM food JOIN restaurant ON food.restaurant=restaurant.restaurant");

// $restaurant=$_GET['restaurant'];

$arr0 = array();

while ($row = mysqli_fetch_array($result)) {
  if ($restaurant == $row["restaurant"]) {
    array_push($arr0, array(
      "name" => $row["classification"],
      "content" => array(
        array(
          "food" => $row["food"],
          "src" => $row["src"],
          "price" => $row["price"],
          "badge" => $row["badge"],
          "badgeColor" => $row["badgeColor"],
          "description" => $row["description"],
          "contact" => $row["contact"],
          "locate" => $row["locate"],
          "des" => $row["des"],
          "img" => $row["img"],
          "views"=>$row["views"],
          "rate"=>$row["rate"],
        ),
      ),
    ));
  }
}
$arr = $arr0;
for ($i = 0; $i < sizeof($arr0); $i++) {
  for ($j = 0; $j < sizeof($arr0); $j++) {
    if ($i != $j) {
      // echo sizeof($arr);
      if ($arr[$i]["name"] == $arr0[$j]["name"]) {
        // echo $arr[$i]["name"];
        array_push($arr[$i]["content"], $arr0[$j]["content"][0]);
        unset($arr[$j]);
      }
    }
  }
}
echo json_encode($arr, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
