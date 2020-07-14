// Power 9 page
var cards = ["Black Lotus","Mox Pearl","Mox Sapphire","Mox Jet","Mox Ruby","Mox Emerald","Time Walk","Timetwister","Ancestral Recall",];

//Function that adds default cards to the binder on page load
function renderBinder() {
  if (cards.pop) {
    $.ajax({
      method: 'GET',
      url: "https://api.scryfall.com/cards/named?fuzzy=" + cards.pop() 
    })
      .then((response) => {
        // Retrieving the URL for the image
        var imgURL = response.image_uris.small;
        // Creating an element to hold the image
        var image = $("<img>").attr("src", imgURL);
        //Gives Modal control attributes to the card image
        image.attr({"data-toggle": "modal","data-target": "#viewCard","data-name": response.name, "class": "mtg img-fluid"});
        // Appending the image
        $("#binder").prepend(image);
        // console.log(response.image_uris.small);
        renderBinder(cards);
        // console.log(response.name)                
      });
  }
}

renderBinder();

//CLEAR BUTTON
$("#clear").on("click", function (event) {
  event.preventDefault();
  $("#binder").empty();
});

// ADD BUTTON
$("#add").on("click", getCard);

//UNDO BUTTON
$("#undo").on("click", function (event) {
  event.preventDefault();
  $('#binder img').last().remove();
});


//Function to get card name froom user input and put it in the binder 
function getCard(event) {
  event.preventDefault();
  var cardName = $("#cardName").val().trim();
  var queryURL = "https://api.scryfall.com/cards/named?fuzzy=" + cardName

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    // Defines the cardart response as a variable
    var cardScan = response.image_uris.small;
    //Defines card name as a variable
    var cardTitle = response.name;
    // Creates an image Element
    var image = $("<img>").attr("src", cardScan);
    //Gives Modal control attributes to the card image
    image.attr({"data-toggle": "modal","data-target": "#viewCard","data-name": response.name, "class": "mtg"});
    // Puts the card art in that element
    $("#binder").append(image);
    // console.log(cardTitle);
  });
}

// CLICK CARDS ANYWHERE ON THE PAGE
$(document).on("click", ".mtg", viewCard);

// CARD VIEWER FEATURE
function viewCard() {
  event.preventDefault();
  var cardName = $(this).attr("data-name");
  var queryURL = "https://api.scryfall.com/cards/named?fuzzy=" + cardName 

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    //Result as a variable
    var viewCard = response.image_uris.normal
    // Creates an image Element
    var image = $("<img>").attr("src", viewCard);
    // Puts the card art in that element
    $("#viewer").html(image);
  });  
}

// ADD Set BUTTON
$("#addSet").on("click", getSet);

// UNDO Set Button
$("#undoSet").on("click", function (event) {
  event.preventDefault();
  $('#setList img').last().remove();
});

//CLEAR Set BUTTON
$("#clearSet").on("click", function (event) {
  event.preventDefault();
  $("#setList").empty();
});

//AJAX to grab the set and add it to the set database
function getSet() {
  event.preventDefault();
  var setName = $("#setName").val().trim();
  var queryURL = "https://api.scryfall.com/sets/" + setName

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    //Set Symbol as a clickable button with attributes
    var setSymbol = $("<img>").attr({"src": response.icon_svg_uri, "alt": response.name, "class": "symClean", "data-name": response.code}) 
    //Add it to the Page
    $("#setList").append(setSymbol)
    //Sends title, icon, name and info to the summary viewer at the top
    $("#nowShowing").text("Now Viewing: " + response.name)
    $("#detInfo").text(response.card_count + " Cards, Released " + response.released_at)
    $("#setThumb").attr({"src": response.icon_svg_uri, "alt": response.name})
  // console.log(response)  
  });  
}
