<?php

require "conexionesBD.php";

$conexion = crearConexionBD();

    $salida = "";

    $query = "SELECT NOMBRE,PRECIOVENTA,NOMBREFAMILIA FROM ARTICULOS ORDER BY NOMBRE";

    if(isset($_POST['consulta'])){
        $palabra = $_POST['consulta'];
        $query = "SELECT NOMBRE,PRECIOVENTA,NOMBREFAMILIA FROM ARTICULOS
        WHERE NOMBRE LIKE '%".$palabra."%' OR PRECIOVENTA LIKE '%".$palabra."%'
        OR NOMBREFAMILIA LIKE '%".$palabra."%'";
        $result=$conexion->prepare($query);
        $result->execute();

        $query2 = "SELECT COUNT(*) FROM ARTICULOS
        WHERE NOMBRE LIKE '%".$palabra."%' OR PRECIOVENTA LIKE '%".$palabra."%'
        OR NOMBREFAMILIA LIKE '%".$palabra."%'";
        $resultrows=$conexion->prepare($query2);
        $resultrows->execute();
        $numrows=$resultrows->fetchColumn();
    }else{
        $result=$conexion->prepare($query);
        $result->execute();

        $query2 = "SELECT COUNT(*) FROM ARTICULOS";
        $resultrows=$conexion->prepare($query2);
        $resultrows->execute();
        $numrows=$resultrows->fetchColumn();
    }

    if($numrows > 0){
        $salida.="<table class='tabla_datos'>
                    <thead>
                        <tr>
                            <td>Nombre</td>
                            <td>Familia</td>
                            <td>Precio</td>
                        </tr>
                    </thead>
                    <tbody>";

        while($fila = $result->fetch(PDO::FETCH_ASSOC)){
            $salida.="<tr>
                        <td>".$fila['NOMBRE']."</td>
                        <td>".$fila['NOMBREFAMILIA']."</td>
                        <td>".$fila['PRECIOVENTA']."</td>
                    </tr>";
        }

        $salida.="</tbody></table>";

    }else{
        $salida.="No se encontraron artículos con sus criterios de búsqueda.";
    }

    echo $salida;

cerrarConexionBD($conexion);

 ?>
