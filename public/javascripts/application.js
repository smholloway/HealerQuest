$(document).ready(function() {
  var DEBUG = false;

  $("select.sensor_name").live('change', function () {
    var id_value_string = $(this).val();
    var parent_div = $(this).parent();
    var sensor_operator_div = $(this).siblings("select.sensor_operator");
    var sensor_value_div = $(this).siblings("select.sensor_value");

    // clear the sibling dropdowns (value and operator)
    sensor_operator_div.empty();
    sensor_value_div.empty();

    if (id_value_string === "") {
      // if the sensor selection is empty clear sibling dropdowns
      var row = "<option value=\"" + "" + "\">" + "" + "</option>";
      $(row).appendTo(sensor_operator_div);
      $(row).appendTo(sensor_value_div);
    } else {
      $.ajax({
        dataType: "json",
        cache: false,
        url: '/sensors/' + id_value_string + "/valid_values",
        timeout: 2000,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Accept", "application/json");
        },
        error: function (XMLHttpRequest, errorTextStatus, error) {
          alert("Failed to submit : " + errorTextStatus + " ;" + error);
        },
        success: function (data) {
          // update the conditional dropdown
          if (typeof(data[0])=='string' && isNaN(data[0])) {
            // update the conditional dropdown for non-ordinal values (e.g., on,off)
            $('<option>==</option>').appendTo(sensor_operator_div);
            $('<option>!=</option>').appendTo(sensor_operator_div);
          } else {
            // update the dropdown for ordinal values (e.g., 0..100)
            $('<option>></option>').appendTo(sensor_operator_div);
            $('<option>>=</option>').appendTo(sensor_operator_div);
            $('<option>==</option>').appendTo(sensor_operator_div);
            $('<option><=</option>').appendTo(sensor_operator_div);
            $('<option><</option>').appendTo(sensor_operator_div);
          }

          // fill the value dropdown
          $.each(data, function(i){
              row = "<option value=\"" + i + "\">" + data[i] + "</option>";
              $(row).appendTo(sensor_value_div);
          });
        }
      });
    }
    // if the rule is now valid, enable the create button to be pressed
    enableMadlibRuleCreation();
  });

	$('#madlib_create').submit(function() {
    if (DEBUG) {
		  alert('madlib_create');			
    }
    var i = 0;

    $('.sensor_name option:selected').each(function(i) {
      sensorIdsArray[i] = $(this).val();
    });
    $('.sensor_operator option:selected').each(function(i) {
      sensorOperatorsArray[i] = $(this).text();
    });
    $('.sensor_value option:selected').each(function(i) {
      sensorValuesArray[i] = $(this).text();
    });
    $('.actuator_name option:selected').each(function(i) {
      actuatorIdsArray[i] = $(this).val();
    });
    $('.actuator_value option:selected').each(function(i) {
      actuatorValuesArray[i] = $(this).text();
    });

    if (DEBUG) {
		  alert("new_rule submitted: \n" + generatedRule);
    }
	});

  $("#unit-frames .unit").live('click', function () {
    alert('unit frames clicked');
    var id_value_string = $(this).html();

    return false;
  });

  $("#spells .spell").live('click', function () {
    alert('spells clicked');
    var id_value_string = $(this).html();

    return false;
  });

  $("span.clickable").live('mouseover mouseout', function () {
    if (event.type == 'mouseover') {
      $(this).addClass("hilite");
    } else  {
      $(this).removeClass("hilite");
    }
  });

  function convertStringToURI(input) {
    return encodeURI(input).replace("#", "%23");
  }

});
