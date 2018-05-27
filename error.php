<?php
	session_start();

	$excepcion = $_SESSION["excepcion"];
	unset($_SESSION["excepcion"]);

	if (isset ($_SESSION["destino"])) {
		$destino = $_SESSION["destino"];
		unset($_SESSION["destino"]);
	} else
		$destino = "";
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" type="text/css" href="css/estilo2.css" />
  <title>Gestión Estanco: Error</title>
</head>
<body>

	<div>
		<h2>Great! You broke it.</h2>
		<?php echo $_SESSION['errores'] ?>
        <div class="userPrompt">
            <img src="https://mi-od-live-s.legocdn.com/r/www/-/media/portal%20v2010/errors/404%20mainstage%20image.jpg?l.r2=1953967734" alt="">
        </div>
		<?php if ($destino<>"") { ?>
		<p>Hubo un problema, pulse <a href="<?php echo $destino ?>">Inicio</a> para volver a la página principal.</p>
		<?php } else { ?>
		<p>Problema al acceder a la base de datos. </p>
		<?php } ?>
	</div>

	<div class='excepcion'>
		<?php echo "Información relativa al problema: $excepcion;" ?>
	</div>

<?php
	include_once("pie.php");
?>

</body>
</html>
