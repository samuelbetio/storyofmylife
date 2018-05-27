<?php
  /*
     * #===========================================================#
     * #	Este fichero contiene las funciones de gestión
     * #	de usuarios de la capa de acceso a datos
     * #==========================================================#
     */

function consultarTodosClientes($conexion) {
     	$consulta = "SELECT * FROM USUARIOS ORDER BY APELLIDOS, NOMBRE";
     	try {
     	    return $conexion->query($consulta);
     	}catch(PDOException $e){
     		$_SESSION['excepcion'] = $e->GetMessage();
     		header("Location: ../error.php");
     	}
}

 function nuevo_cliente($conexion,$nuevoUsuario) {
   // BUSCA LA OPERACIÓN ALMACENADA "INSERTAR_USUARIO" EN SQL
 	// 			PARA SABER CUÁLES SON SUS PARÁMETROS.
 	// RECUERDA QUE SE INVOCA MEDIANTE 'CALL' EN PL/SQL
 	// RECUERDA QUE EL FORMATO DE FECHA PARA ORACLE ES "d/m/Y"
 	// UTILIZA EL MÉTODO "PREPARE" DEL OBJETO PDO
 	// RECUERDA EL TRY/CATCH
    $fechaNacimiento=date('d-m-Y',strtotime($nuevoUsuario["fechaNacimiento"]));
    try{
    $insert="INSERT INTO USUARIOS (IDCLIENTE,NOMBRE,APELLIDOS,FECHA_NACIMIENTO,EMAIL,PASS,ACEPTADO,TIPO) VALUES (sec_idcliente.NEXTVAL,:nombre,:ape,to_date('".$fechaNacimiento."','dd-mm-yy'),:email,:pass,'0','Cliente')";
    $usuarios=$conexion->prepare($insert);
    $usuarios->bindParam(':email',$nuevoUsuario["email"]);
    $usuarios->bindParam(':pass',$nuevoUsuario["password"]);
    $usuarios->bindParam(':nombre',$nuevoUsuario["nombre"]);
    $usuarios->bindParam(':ape',$nuevoUsuario["apellidos"]);
    $usuarios->execute();
     return true;

   } catch(PDOException $e){
     return false;
   }
}

// ESTA FUNCIÓN SE EDITA EN LA SEGUNDA PARTE DE LA PRÁCTICA
function consultarCliente($conexion,$email,$pass) {
	// SENTENCIA SELECT PARA CONTAR CUANTOS USUARIOS HAY
	// 		CON DICHO EMAIL Y PASS
	// UTILIZA EL MÉTODO "PREPARE" DEL OBJETO PDO
	// RETORNE EL RESULTADO DEL MÉTODO "FETCHCOLUMN"
  $stmt=$conexion->prepare('SELECT COUNT(*) AS TOTAL FROM USUARIOS WHERE EMAIL=:email AND PASS=:pass');
  $stmt->bindParam(":email",$email);
  $stmt->bindParam(":pass",$pass);
  $stmt->execute();
  return $stmt->fetchColumn();

}

function modificar_cliente($conexion,$idCliente,$nombre,$apellidos,$fechaNacimiento) {
	try {
		$stmt=$conexion->prepare('CALL MOD_CLIENTE(:idCliente,:nombre,:apellidos,:fechaNacimiento)');
		$stmt->bindParam(':idCliente',$idCliente);
		$stmt->bindParam(':nombre',$nombre);
        $stmt->bindParam(':apellidos',$apellidos);
        $stmt->bindParam(':fechaNacimiento',$fechaNacimiento);
		$stmt->execute();
		return true;
	} catch(PDOException $e) {
		return false;
    }
}

function aceptar_cliente($conexion,$idCliente) {
	try {
		$stmt=$conexion->prepare('CALL ACEPTAR_CLIENTE(:idCliente)');
		$stmt->bindParam(':idCliente',$idCliente);
		$stmt->execute();
		return true;
	} catch(PDOException $e) {
		return false;
    }
}

function quitar_cliente($conexion,$idCliente) {
	try {
		$stmt=$conexion->prepare('CALL DEL_CLIENTE(:idCliente)');
		$stmt->bindParam(':idCliente',$idCliente);
		$stmt->execute();
		return "";
	} catch(PDOException $e) {
		return $e->getMessage();
    }
}

?>
