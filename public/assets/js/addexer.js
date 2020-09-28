$(document).ready(function () {

    var exerForm = $("form.add");
  
    exerForm.on("submit", function () {
    
      var exerData = {
        exerName: $("#exerName").val().trim(),
        main: $("#main").val().trim(),
        alternate: $("#alternate").val().trim(),
        auxillary: $("#auxillary").val().trim(),
        equipment: $("#equipment").val().trim(),
        upper: $("#upper").val(),
        push: $("#push").val(),
        compound: $("#compound").val(),
      };

      addExer(exerData.exerName, exerData.main, exerData.alternate, exerData.auxillary, exerData.equipment, exerData.upper, exerData.push, exerData.compound);
    });
  
    function addExer(exerName, main, alternate, auxillary, equipment, upper, push, compound) {
      $.post("/api/exercises", {
        exerName: exerName,
        main: main, 
        alternate: alternate,
        auxillary: auxillary, 
        equipment: equipment,
        upper: upper,
        push: push,
        compound: compound
      })
        .then(function (data) {
        location.reload()
          // If there's an error, handle it by throwing up a bootstrap alert
        })
        .catch(handleLoginErr);
    }
  
    function handleLoginErr(err) {
      $("#alert .msg").text(err.responseJSON);
      $("#alert").fadeIn(500);
    }
  });
  