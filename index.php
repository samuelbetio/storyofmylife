<?php
    session_start();

    if(isset($_SESSION['usuario'])){
        if($_SESSION['usuario']['TIPO'] == 'Propietario'){
            header('Location: Propietario/');
        }else if($_SESSION['usuario']['TIPO'] == 'Gerente'){
            header('Location: Gerente/');
        }else if($_SESSION['usuario']['TIPO'] == 'Empleado'){
            header('Location: Empleado/');
        }else if($_SESSION['usuario']['TIPO'] == 'Cliente'){
            header('Location: Cliente/');
        }
    }
 ?>


<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="css/main.css">

    <script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.3.min.js"></script>
    <script src="js/login.js"></script>

    <title>Login Ajax</title>
</head>
<body>
    <div class="error">
        <span>Datos de Ingreso no válidos, inténtalo de nuevo</span>
    </div>

    <div class="main">
        <form action="procesar_login.php" id="formlg" method="post">
            <input type="text" name="emaillg" placeholder="Email" pattern="^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$" required />
            <input type="password" name="passlg" placeholder="Contraseña" pattern="[A-Za-z0-9_-]{1,15}" required />
            <input type="submit" class="botonlg" value="Iniciar Sesión"/>
        </form>
    </div>

</body>
</html>
