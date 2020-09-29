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

// function getSet(event) {
//   event.preventDefault();
//   // prepare the viewer
//   $("#viewer").empty();

//   let setId = $(this).find(':selected').attr('data-id')
//   // Search Our CARDS database for all that belong that that SetID
//   $.ajax("/api/cards/" + setId, {
//     type: "GET"
//   }).then(function (response) {
//     console.log(response)
//     // Ask the Scryfall API (on loop) for current and detailed card information
//     for (let i = 0; i < response.length; i++) {
//       $.ajax({
//         url: "https://api.scryfall.com/cards/named?fuzzy=" + response[i].cardName,
//         method: "GET"
//       }).then(function (response) {
//           // loop through the responses and populate the viewer
//           for (let i = 0; i < response.length; i++) {
//             $("#myCards").append(`<tr>
//               <td scope="col" data-name="${response[i].name}" class="mtg">${response[i].name}</td>
//               <td scope="col">${response[i].rarity}</td>
//               <td scope="col">${response[i].set_name}</td>
//               <td scope="col">${response[i].type_line}</td>
//               </tr>`);
//             $("#viewer").append(`<img class="half" src=${response[i].image_uris.normal}>`);
//           }
//         })
//     }
//   })
// }

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