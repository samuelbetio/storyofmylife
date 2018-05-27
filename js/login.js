jQuery(document).on('submit', '#formlg', function(event) {
    event.preventDefault();

    jQuery.ajax({
      url: 'procesar_login.php',
      type: 'POST',
      dataType: 'json',
      data: $(this).serialize(),
      beforeSend: function() {
          $('.botonlg').val('Validando...');
      }
    })
    .done(function(respuesta) {
      console.log(respuesta);
      if(!respuesta.error){
        if(respuesta.tipo == 'Propietario'){
          location.href = 'Propietario/';
        }else if(respuesta.tipo == 'Cliente'){
          location.href = 'Cliente/';
        }else if(respuesta.tipo == 'Gerente'){
          location.href = 'Gerente/';
        }else if(respuesta.tipo == 'Empleado'){
          location.href = 'Empleado/';
        }
      }else{
        $('.error').slideDown('slow');
        setTimeout(function() {
          $('.error').slideUp('slow');
        },3000);
        $('.botonlg').val('Iniciar Sesión');
      }
    })
    .fail(function(resp) {
      console.log(resp.responseText);
    })
    .always(function() {
      console.log("complete");
    });

});
