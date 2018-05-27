<?php session_start(); ?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://bootswatch.com/yeti/bootstrap.min.css" rel="stylesheet">
    <link href="css/register.css" rel="stylesheet">

    <script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.3.min.js"></script>
    <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.16.0/jquery.validate.min.js"></script>
    <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.16.0/additional-methods.min.js"></script>
    <script src="js/validacionRegistro.js"></script>
    <script src='https://www.google.com/recaptcha/api.js'></script>

    <title>Document</title>
</head>
<body>
    <div id="form">
    <form action="procesar_nuevo_usuario.php" id="register-form" method="post" html="{:multipart=>true}"/>
        <div class="form-group">
        <input id="nombre" name="nombre" placeholder="Nombre" class="form-control" type="text" pattern="[A-Za-z0-9_-]{1,}" required/>
        <span class="glyphicon form-control-feedback"></span>
        </div>
        <div class="form-group">
        <input id="apellidos" name="apellidos" placeholder="Apellidos" class="form-control" type="text" pattern="[A-Za-z0-9_-]{1,}" required/>
        <span class="glyphicon form-control-feedback"></span>
        </div>
        <div class="form-group">
        <input id="fechaNacimiento" name="fechaNacimiento" class="form-control" type="date" required/>
        </div>
        <div class="form-group">
        <input id="email" name="email" placeholder="Email" class="form-control" type="text" onblur="accountExists()" pattern="^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$" required/>
        <label id="emnotav"></label>
        </div>
        <div class="form-group">
        <input id="password" name="password" placeholder="Contraseña" class="form-control" type="password" pattern="[A-Za-z0-9]{1,}" required/>
        <span class="glyphicon form-control-feedback"></span>
        </div>
        <div class="form-group">
        <input id="password_confirmation" name="password_confirmation" placeholder="Repite la Contraseña" class="form-control" type="password" pattern="[A-Za-z0-9]{1,}" required/>
        <span class="glyphicon form-control-feedback"></span>
        </div>
        <div class="g-recaptcha" data-sitekey="6LdUaR8UAAAAAGnxXjdJ3I-sDWqhh8zf-FmRuw58"></div>
        <span class="help-block-red">
        <?php if(isset($_SESSION['recaptcha'])){
                echo $_SESSION['recaptcha'];
                unset($_SESSION['recaptcha']);
        }?>
        </span>
        <div>
        <input class="btn btn-default btn-register" name="commit" type="submit" value="Regístrate"/>
        </div>
    </form>
    </div>
</body>
</html>
