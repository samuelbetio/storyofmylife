<?php
    session_start();

    if(!isset($_SESSION['resgistrook'])){
        Header('Location: register.php');
    }else{
        unset($_SESSION['resgistrook']);
    }
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Registrado Correctamente</title>
</head>
<body>
    <h2>Registrado correctamente, <a href="index.php">inicie sesión.</a></h2>
</body>
</html>

<script language="javascript">
window.setTimeout(function() {
    window.location.replace('index.php');
}, 2500);
</script>
