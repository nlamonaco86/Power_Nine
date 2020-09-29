// GET user and cloud info on page load
function personalizePage() {
    $.ajax("/api/user_data/", {
        type: "GET"
    }).then(function (response) {
        //fill out the user's profile section
        $("#profilePic").attr("src", response.profilePic);
        $("#userName").text(response.name);
        console.log(response);
    });
}
personalizePage();

// UPDATE PROFILE FORM
let updateForm = $("form.update");

updateForm.on("submit", function (event) {
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
      let image = $("<img>").attr({"src": response.image_uris.normal, "class": "half"});
      // Puts the card art in that element
      $("#viewer").html(image);
    });
  }