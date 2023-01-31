<?php
try {
    $bdd = new PDO('mysql:host=IP;dbname=NOM-DE-LA-DB;charset=utf8;', 'UTILISATEUR', 'MOT-DE-PASSE');
} catch (Exeption $e){
    die('Une erreur à été rencontrée lors de la connection avec la base de données: '. $e->getMessage());
}

if(empty($_GET['id'])){
    echo '{"status": "failed"}';
    return;
}else{
    $id = $_GET['id'];
}

$check = $bdd->prepare('SELECT * FROM users WHERE id=?');
$check->execute(array($id));
$checked = $check->fetch();

if ($checked['dailytime'] <= strtotime('-1 day')) {
    $daily = "\"daily\":\"true\"";
} else {
    $daily = "\"daily\":\"false\"";
}

if ($checked['weeklytime'] <= strtotime('-1 week')) {
    $weekly = "\"weekly\":\"true\"";
} else {
    $weekly = "\"weekly\":\"false\"";
}

if ($checked['monthlytime'] <= strtotime('-1 month')) {
    $monthly = "\"monthly\":\"true\"";
} else {
    $monthly = "\"monthly\":\"false\"";
}

echo '{'.$daily.','.$weekly.','.$monthly.',"status":"success"'.'}';
