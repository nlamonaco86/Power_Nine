// GET user and cloud info on page load
function personalizePage() {
  $.ajax("/api/user_data/", {
    type: "GET"
  }).then(function (response) {
    let id = response.id
    //fill out the user's profile section
    $("#profilePic").attr("src", response.profilePic);
    $("#userName").text(response.name);

    //Request the list of User's sets from Our API 
    $.ajax("/api/sets/" + id, {
      type: "GET"
    }).then(function (response) {
      // loop through the user's sets to populate the form options 
      for (let i = 0; i < response.length; i++) {
        $("#setOptions").append(`<option data-id="${response[i].id}">${response[i].setName}</option>`)
      }
    })
  });
}
personalizePage();

// UPDATE PROFILE FORM
$("form.update").on("submit", function (event) {
  event.preventDefault();
  console.log("update");
})

function populateUsers() {
  $.ajax("/api/user_data/all", {
    type: "GET"
  }).then(function (response) {
    $("#traders").empty();
    //loop through the user data and populate the trade section
    for (let i = 0; i < response.length; i++) {
      $("#traders").append(`
      <div class="col-lg-2 white shadow pad">
      <div class="d-flex justify-content-center"><img src="${response[i].profilePic}" alt="user pic" class="d-flex justify-content-center img-round"></div>
        <h3 class="d-flex justify-content-center">${response[i].name}</h3>
        <div class="d-flex justify-content-center">
          <button class="btn-lg btn-circle bg-purple text-light" data-name="${response[i].id}"><i class="fa fa-exchange-alt fa-2x text-light"></i></button>
        </div>
      </div>`)
    }
  })
}
populateUsers();

//~~~~~~~~~~~~~~~~~~~~~~~~~~ CARD SEARCH FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
$(".searchCard").on("submit", getCard);

function getCard(event) {
  event.preventDefault();

  $.ajax({
    url: "https://api.scryfall.com/cards/named?fuzzy=" + $("#cardName").val().trim(),
    method: "GET"
  }).then(function (response) {

    $("#viewer").empty();
    console.log(response);
    $("#myCards").append(`<tr>
      <td scope="col" data-name="${response.name}" class="mtg">${response.name}</td>
      <td scope="col">${response.rarity}</td>
      <td scope="col">${response.set_name}</td>
      <td scope="col">${response.type_line}</td>
      </tr>`);

    $("#viewer").append(`<img class="half" src=${response.image_uris.normal}>`);

  })
}

// CLICK CARDS ANYWHERE ON THE PAGE
$(document).on("click", ".mtg", viewCard);

function viewCard(event) {
  event.preventDefault();
  // This fixes viewer issue but only in set view, not in "free-view" - needs and if/else 
  //  + "&set=" + $(".toView").attr("data-name");
  $.ajax({
    url: "https://api.scryfall.com/cards/named?fuzzy=" + $(this).attr("data-name"),
    method: "GET"
  }).then(function (response) {
    // Creates an image Element
    let image = $("<img>").attr({ "src": response.image_uris.normal, "class": "half" });
    // Puts the card art in that element
    $("#viewer").html(image);
  });
}

// RECALL A SET AND DISPLAY IT IN THE VIEWER
$("form.mySets").on("submit", getSet)

function getSet(event) {
  event.preventDefault();

  let setId = $(this).find(':selected').attr('data-id')
  // Search Our CARDS database for all Cards that belong to that SetID
  $.ajax("/api/cards/" + setId, {
    type: "GET"
  }).then(function (response) {
    // Blank array to hold all the card objects requested 
    let allMyAjax = [];
    for (let i = 0; i < response.length; i++) {
      // Pushes all the AJAX requests into that blank array
      allMyAjax.push(
        $.ajax({
          method: 'GET',
          url: "https://api.scryfall.com/cards/named?fuzzy=" + response[i].cardName
        }));
    };
    //Waits for the allMyAjax array to be done
    Promise.all(allMyAjax)
      .then(function (response) {
        // empty the viewer
        $("#myCards").empty();
        //Loop through the detailed, current data from Scryfall and append the viewer
        for (let i = 0; i < response.length; i++) {

          $("#myCards").append(`<tr>
            <td scope="col" data-name="${response[i].name}" class="mtg">${response[i].name}</td>
            <td scope="col">${response[i].rarity}</td>
            <td scope="col">${response[i].set_name}</td>
            <td scope="col">${response[i].type_line}</td>
            </tr>`);
          $("#viewer").html(`<img class="half" src=${response[i].image_uris.normal}>`);
        }
      });
  })
}