function accountExists() {
  var email=document.getElementById("email").value;
  $.ajax({
      type:'post',
      url:'checkEmail.php',
      data:'email='+email,
      success:function(msg){
            $('#emnotav').html(msg);
            if(!($('#emnotav').is(':empty'))){
              $('#email').closest('.form-group').removeClass('has-success');
              $('#email').closest('.form-group').addClass('has-error has-feedback');
              $('#emnotav').addClass('help-block-red');
            }
      }
   });
}

$(function() {

  $.validator.setDefaults({
    errorClass: 'help-block',
    highlight: function(element) {
      var closestdiv = $(element).closest('.form-group');
      closestdiv.removeClass('has-success');
      closestdiv.addClass('has-error has-feedback');
    //  closestdiv.children('span').eq(0).removeClass('glyphicon-ok');
    //  closestdiv.children('span').eq(0).addClass('glyphicon-remove');
    },
    unhighlight: function(element) {
      var closestdiv2 = $(element).closest('.form-group');
      closestdiv2.removeClass('has-error');
      closestdiv2.addClass('has-success has-feedback');
    //  closestdiv2.children('span').eq(0).removeClass('glyphicon-remove');
    //  closestdiv2.children('span').eq(0).addClass('glyphicon-ok');
    },
    errorPlacement: function (error, element) {
      if (element.prop('type') === 'checkbox') {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    }
  });

  $.validator.addMethod('strongPassword', function(value, element) {
    return this.optional(element)
      || value.length >= 8
      && /\d/.test(value)
      && /[A-Z]/.test(value)
      && /[a-z]/i.test(value);
  }, 'La contraseña debe tener al menos 8 caracteres y contener al menos un dígito, una minúscula y una mayúscula.')

  $("#register-form").validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        strongPassword: true
      },
      password_confirmation: {
        required: true,
        strongPassword: true,
        equalTo: '#password'
      },
      nombre: {
        required: true,
        lettersonly: true
      },
      apellidos: {
        required: true,
        lettersonly: true
      },
      fechaNacimiento: {
        required: true
      }
    },
    messages: {
      email: {
        required: 'Rellene este campo.',
        email: 'Por favor introduzca un email <em>válido</em>.'
      },
      password: {
        required: 'Rellene este campo.',
      },
      password_confirmation: {
        required: 'Rellene este campo.',
        equalTo: 'Contraseña no coincide.'
      },
      nombre: {
        required: 'Rellene este campo.',
        lettersonly: 'Nombre no válido.'
      },
      apellidos: {
        required: 'Rellene este campo.',
        lettersonly: 'Apellidos no válidos.'
      },
      fechaNacimiento: {
        required: 'Rellene este campo.'
      }
    }
  });

});
