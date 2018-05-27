<?php
  /*
     * #===========================================================#
     * #	Este fichero contiene las funciones de gestión
     * #	de contactos de la capa de acceso a datos
     * #==========================================================#
     */

function consultarTodosContactos($conexion) {
     	$consulta = "SELECT * FROM CONTACTOS ORDER BY IDCONTACTO";
     	try {
     	    return $conexion->query($consulta);
     	}catch(PDOException $e){
     		$_SESSION['excepcion'] = $e->GetMessage();
     		header("Location: ../error.php");
     	}
}

 function nuevo_contacto($conexion,$contacto) {
   try{
     $stmt=$conexion->prepare('CALL NUEVO_CONTACTO(:nombre,:ape,:email,:mensaje)');
     $stmt->bindParam(':nombre',$contacto["nombre"]);
     $stmt->bindParam(':ape',$contacto["apellidos"]);
     $stmt->bindParam(':email',$contacto["email"]);
     $stmt->bindParam(':pass',$contacto["mensaje"]);
     $stmt->execute();
     return true;

   } catch(PDOException $e){
     return false;
   }
}

function quitar_contacto($conexion,$idContacto) {
	try {
		$stmt=$conexion->prepare('CALL DEL_CONTACTO(:idContacto)');
		$stmt->bindParam(':idContacto',$idContacto);
		$stmt->execute();
		return "";
	} catch(PDOException $e) {
		return $e->getMessage();
    }
}

?>
