<?php
    session_start();

    if(!isset($_SESSION['contactook'])){
        Header('Location: contacto.php');
    }else{
        unset($_SESSION['contactook']);
    }
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Contacto mandado Correctamente</title>
</head>
<body>
    <h2>Contacto mandado correctamente. <a href="index.php">INICIO</a></h2>
</body>
</html>

<script language="javascript">
window.setTimeout(function() {
    window.location.replace('index.php');
}, 3000);
</script>
