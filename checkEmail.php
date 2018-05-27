<?php

require_once("conexionesBD.php");

$conexion=crearConexionBD();

$email=$_POST['email'];
$stmt=$conexion->prepare('SELECT COUNT(*) FROM USUARIOS WHERE EMAIL=:email');
$stmt->bindParam(':email',$email);
$stmt->execute();

$emails=$stmt->fetchColumn();

  if($emails!=0){
      echo "El email ".$email." ya está asociado a una cuenta";
  }

cerrarConexionBD($conexion);

?>
