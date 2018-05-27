<?php
    session_start();

    if(isset($_SESSION['usuario'])){
        if($_SESSION['usuario']['TIPO'] != 'Cliente'){
            header('Location: ../');
        }
    }else{
        header('Location: ../');
    }
 ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Bienvenido <?php echo $_SESSION['usuario']['NOMBRE'] ?> </h1>

    <a href="../logout.php">Cerrar sesión</a>

</body>
</html>
