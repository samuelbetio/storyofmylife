<?php

	session_start();

require "conexionesBD.php";
require "gestionClientes.php";

if(isset($_POST['g-recaptcha-response']) && $_POST['g-recaptcha-response']){

	$secret = "6LdUaR8UAAAAAHXWf98CTBs1MnjKAem2rfOnnVGR";
	$captcha = $_POST['g-recaptcha-response'];
	$result = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=$captcha");
	$recaptcha = json_decode($result,TRUE);
	$errores = "";
	
	if($recaptcha["success"]){

		$conexion=crearConexionBD();

		$nuevoUsuario["nombre"] = $_POST["nombre"];
		$nuevoUsuario["apellidos"] = $_POST["apellidos"];
		$nuevoUsuario["email"] = $_POST["email"];
		$nuevoUsuario["fechaNacimiento"] = $_POST["fechaNacimiento"];
		$nuevoUsuario["password"] = $_POST["password"];
		$nuevoUsuario["password_confirmation"] = $_POST["password_confirmation"];

		$_SESSION["registro"] = $nuevoUsuario;

		$errores = validarDatosUsuario($nuevoUsuario);

		if (count($errores)>0) {
			$_SESSION["errores"] = $errores;
			Header('Location: error.php');
		}else{
			if(isset($_SESSION["registro"]) && nuevo_cliente($conexion,$nuevoUsuario)){
				$_SESSION['resgistrook']= "Registrado correctamente, inicie sesión.";
				Header('Location: exito_registro.php');
			}
		}
	}else{
		$_SESSION['recaptcha'] = 'ReCaptcha Inválido.';
		Header('Location: register.php');
	}
}else{
	$_SESSION['recaptcha'] = 'ReCaptcha Inválido.';
	Header('Location: register.php');
}

function validarDatosUsuario($nuevoUsuario){

	if($nuevoUsuario["nombre"]=="")
	  $errores[] = "<p>El nombre no puede estar vacío</p>";

	if($nuevoUsuario["apellidos"]=="")
	  $errores[] = "<p>Los apellidos no pueden estar vacíos</p>";

	if($nuevoUsuario["email"]==""){
	  $errores[] = "<p>El email no puede estar vacío</p>";
	}else if(!filter_var($nuevoUsuario["email"], FILTER_VALIDATE_EMAIL)){
	  $errores[] = $error . "<p>El email es incorrecto: " . $nuevoUsuario["email"]. "</p>";
	}

	if(!isset($nuevoUsuario["password"]) || strlen($nuevoUsuario["password"])<8){
	  $errores [] = "<p>Contraseña no válida: debe tener al menos 8 caracteres</p>";
	}else if(!preg_match("/[a-z]+/", $nuevoUsuario["password"]) ||
	  !preg_match("/[A-Z]+/", $nuevoUsuario["password"]) || !preg_match("/[0-9]+/", $nuevoUsuario["password"])){
	  $errores[] = "<p>Contraseña no válida: debe contener letras mayúsculas y minúsculas y dígitos</p>";
	}else if($nuevoUsuario["password"] != $nuevoUsuario["password_confirmation"]){
	  $errores[] = "<p>La confirmación de contraseña no coincide con la contraseña</p>";
	}

	return $errores;
}

cerrarConexionBD($conexion);

?>
