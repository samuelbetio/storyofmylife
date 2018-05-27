<?php

	session_start();

require "conexionesBD.php";
require "gestionContactos.php";

if(isset($_POST['g-recaptcha-response']) && $_POST['g-recaptcha-response']){

	$secret = "6LdUaR8UAAAAAHXWf98CTBs1MnjKAem2rfOnnVGR";
	$captcha = $_POST['g-recaptcha-response'];
	$result = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=$captcha");
	$recaptcha = json_decode($result,TRUE);

	if($recaptcha["success"]){

		$conexion=crearConexionBD();

		$contacto["nombre"] = $_POST['fname'];
		$contacto["apellidos"] = $_POST['lname'];
		$contacto["email"]= $_POST['email'];
		$contacto["mensaje"] = $_POST['message'];

		$_SESSION["contacto"] = $contacto;

		$errores = validarDatosContacto($contacto);

		if (count($errores)>0) {
			$_SESSION["errores"] = $errores;
			Header('Location: error.php');
		}else{
			if(isset($_SESSION["contacto"]) && nuevo_contacto($conexion,$contacto)){
				$_SESSION['contactook']= "Contacto mandado correctamente.";
				Header('Location: exito_contacto.php');
			}
		}
	}else{
		$_SESSION['recaptcha'] = 'ReCaptcha Inválido.';
		Header('Location: contacto.php');
	}
}else{
	$_SESSION['recaptcha'] = 'ReCaptcha Inválido.';
	Header('Location: contacto.php');
}

function validarDatosContacto($contacto){

	if($contacto["nombre"]=="")
	  $errores[] = "<p>El nombre no puede estar vacío</p>";

	if($contacto["apellidos"]=="")
	  $errores[] = "<p>Los apellidos no pueden estar vacíos</p>";

	if($contacto["email"]==""){
	  $errores[] = "<p>El email no puede estar vacío</p>";
    }else if(!filter_var($contacto["email"], FILTER_VALIDATE_EMAIL)){
	  $errores[] = $error . "<p>El email es incorrecto: " . $contacto["email"]. "</p>";
	}

    if($contacto["mensaje"]=="")
	  $errores[] = "<p>El mensaje no puede estar vacío</p>";

	return $errores;
}

cerrarConexionBD($conexion);

?>
