<?php

function crearConexionBD()
{
	$host="oci:dbname=localhost/XE;charset=UTF8";
	$usuario="GESTANCO2";
	$password="gestanco";

	try{
		$conexion=new PDO($host,$usuario,$password,array(PDO::ATTR_PERSISTENT => true));
    	$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $conexion;
	}catch(PDOException $e){
		$_SESSION['excepcion'] = $e->GetMessage();
		header("Location: error.php");
	}
}

function cerrarConexionBD($conexion){
	$conexion=null;
}

?>
