<?php session_start(); ?>
<!DOCTYPE HTML>
<html lang="es">
	<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Estanco Nº1 &mdash; Ibros (Jaén)</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<!-- jQuery -->
	<script src="js/jquery.min.js"></script>
	<!-- jQuery Easing -->
	<script src="js/jquery.easing.1.3.js"></script>
	<!-- Bootstrap -->
	<script src="js/bootstrap.min.js"></script>
	<!-- Waypoints -->
	<script src="js/jquery.waypoints.min.js"></script>
	<!-- Stellar Parallax -->
	<script src="js/jquery.stellar.min.js"></script>
	<!-- Carousel -->
	<script src="js/owl.carousel.min.js"></script>
	<!-- Flexslider -->
	<script src="js/jquery.flexslider-min.js"></script>
	<!-- countTo -->
	<script src="js/jquery.countTo.js"></script>
	<!-- Magnific Popup -->
	<script src="js/jquery.magnific-popup.min.js"></script>
	<script src="js/magnific-popup-options.js"></script>
	<!-- Google Map -->
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCefOgb1ZWqYtj7raVSmN4PL2WkTrc-KyA&sensor=false"></script>
	<script src="js/google_map.js"></script>
	<!-- Main -->
	<script src="js/main.js"></script>
	<!--Validacion Contacto-->
	<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.3.min.js"></script>
	<script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.16.0/jquery.validate.min.js"></script>
	<script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.16.0/additional-methods.min.js"></script>
	<script src="js/validacionContacto.js"></script>

	<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Roboto+Slab:300,400" rel="stylesheet">

	<!-- Animate.css -->
	<link rel="stylesheet" href="css/animate.css">
	<!-- Icomoon Icon Fonts-->
	<link rel="stylesheet" href="css/icomoon.css">
	<!-- Bootstrap  -->
	<link rel="stylesheet" href="css/bootstrap.css">
	<!-- Magnific Popup -->
	<link rel="stylesheet" href="css/magnific-popup.css">
	<!-- Owl Carousel  -->
	<link rel="stylesheet" href="css/owl.carousel.min.css">
	<link rel="stylesheet" href="css/owl.theme.default.min.css">
	<!-- Flexslider  -->
	<link rel="stylesheet" href="css/flexslider.css">
	<!-- Pricing -->
	<link rel="stylesheet" href="css/pricing.css">
	<!-- Theme style  -->
	<link rel="stylesheet" href="css/style.css">
	<!-- Modernizr JS -->
	<script src="js/modernizr-2.6.2.min.js"></script>

	<link rel="stylesheet" href="css/main.css">
	<script src='https://www.google.com/recaptcha/api.js'></script>
	</head>
	<body>

	<div id="page">

		<!--<?php //include_once("includes/cabecera.php") ?>-->

		<div id="map" class="fh5co-map"></div>

	<div id="fh5co-contact">
		<div class="container">
			<div class="row">
				<div class="col-md-5 col-md-push-1 animate-box">

					<div class="fh5co-contact-info">
						<h3>¡Ven a visitarnos!</h3>
						<ul>
							<li class="address">Calle Virgen de los Remedios Nº50, <br> Ibros (Jaén) 23450</li>
							<li class="phone"><a>+ 123 456 789</a></li>
							<li class="email"><a href="mailto:gestion@estanco.com">gestanco@protonmail.com</a></li>
						</ul>
					</div>

				</div>
				<div class="col-md-6 animate-box">
					<h3>¡Contacta con nosotros!</h3>
					<form id="contact-form" action="procesar_contacto.php">
						<div class="row form-group">
								<input type="text" id="fname" class="form-control" placeholder="Nombre" required>
						</div>
						<div class="row form-group">
								<input type="text" id="lname" class="form-control" placeholder="Apellidos" required>
						</div>

						<div class="row form-group">
								<input type="text" id="email" class="form-control" pattern="^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$" placeholder="Email" required>
						</div>

						<div class="row form-group">
								<textarea name="message" id="message" cols="30" rows="10" class="form-control" placeholder="Escriba aquí su mensaje. Le responderemos lo antes posible. Gracias :)" required></textarea>
						</div>
						<div class="g-recaptcha" data-sitekey="6LdUaR8UAAAAAGnxXjdJ3I-sDWqhh8zf-FmRuw58"></div>
				        <span class="help-block-red">
				        <?php if(isset($_SESSION['recaptcha'])){
				                echo $_SESSION['recaptcha'];
				                unset($_SESSION['recaptcha']);
				        }?>
				        </span>
						<div class="form-group">
							<input type="submit" value="Enviar" class="btn btn-primary">
						</div>

					</form>
				</div>
			</div>

		</div>
	</div>


	<!--<?php //include_once("includes/pie.php") ?>-->



	<div class="gototop js-top">
		<a href="#" class="js-gotop"><i class="icon-arrow-up"></i></a>
	</div>

	</div>
</body>
</html>
