$(function() {

  $.validator.setDefaults({
    errorClass: 'help-block',
    highlight: function(element) {
      var closestdiv = $(element).closest('.form-group');
      closestdiv.removeClass('has-success');
      closestdiv.addClass('has-error has-feedback');
    },
    unhighlight: function(element) {
      var closestdiv2 = $(element).closest('.form-group');
      closestdiv2.removeClass('has-error');
      closestdiv2.addClass('has-success has-feedback');
    },
    errorPlacement: function (error, element) {
      if (element.prop('type') === 'checkbox') {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    }
  });

  $("#contact-form").validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      fname: {
        required: true,
        lettersonly: true
      },
      lname: {
        required: true,
        lettersonly: true
      },
      message:{
        required: true
      }
    },
    messages: {
      email: {
        required: 'Rellene este campo.',
        email: 'Por favor introduzca un email <em>válido</em>.'
      },
      fname: {
        required: 'Rellene este campo.',
        lettersonly: 'Nombre no válido.'
      },
      lname: {
        required: 'Rellene este campo.',
        lettersonly: 'Apellidos no válidos.'
      },
      message: {
        required: 'Rellene este campo.'
      }
    }
  });

});
