// default display array
var cards = ["Black Lotus", "Mox Pearl", "Mox Sapphire", "Mox Jet", "Mox Ruby", "Mox Emerald", "Time Walk", "Timetwister", "Ancestral Recall",];

//Function that adds default cards to the binder on page load
function renderBinder() {
  for (var i = 0; i < cards.length; i++) {
    $.ajax({
      method: 'GET',
      url: "https://api.scryfall.com/cards/named?fuzzy=" + cards[i]

    }).then(function (response) {
      fetchMTG(response)
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
    fetchMTG(response)
  });
}

function fetchMTG(item) {
  // Defines the cardart response as a variable
  var cardScan = item.image_uris.small;
  // Creates an image Element
  var image = $("<img>").attr("src", cardScan);
  //Gives Modal control attributes to the card image
  image.attr({ "data-toggle": "modal", "data-target": "#viewCard", "data-name": item.name, "class": "mtg cardPad" });
  // Puts the card art in that element
  $("#binder").append(image);
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
  $("#binder").empty();
  $("#ring").empty();
  $("#infoTab").empty();
  renderBinder();
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
    var setSymbol = $("<img>").attr({ "src": response.icon_svg_uri, "alt": response.name, "class": "symClean set", "data-name": response.code })
    //Add it to the Page
    $("#setList").append(setSymbol)
    fetchSet(response)
  });
}

// CLICK SETS ANYWHERE ON THE PAGE
$(document).on("click", ".set", viewSet);

//CLICK PAGE TABS ANYWHERE ON THE PAGE
$(document).on("click", ".setBtn", fetchPage);

function viewSet() {
  event.preventDefault();
  var setName = $(this).attr("data-name");
  var queryURL = "https://api.scryfall.com/sets/" + setName

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    fetchSet(response)
  });
}

function fetchSet(box) {
  // gets 1 page per 9 cards, rounded up
  var pageNum = Math.ceil(box.card_count / 9)
  //Sends title, icon, name and info to the summary viewer at the top
  $("#nowShowing").text("Now Viewing: " + box.name)
  $("#detInfo").text(box.card_count + " Cards, Released " + box.released_at)
  $("#setThumb").attr({ "src": box.icon_svg_uri, "alt": box.name, "class": "toView symTiny", "data-name": box.code })
  //Empty the binder 
  $("#binder").empty();
  //Empty the binder ring
  $("#ring").empty();
  //Makes "Page" buttons on the binder when a set is searched 
  for (var i = 0; i < pageNum; i++) {
    //Makes button a variable 
    var pageBtn = $("<button>");
    // Adds number attr to the page button
    pageBtn.attr({ "data-name": i + 1, "class": "btn btn-secondary setBtn" });
    // Puts a number on the button
    pageBtn.text(i + 1);
    // Adds the button to the binder ring
    $("#ring").append(pageBtn);
  }
  showPage();
}

function fetchPage() {
// fetches a specific "page" of the binder based on the set currently being viewed, and the page number 
  var c = $(".toView").attr("data-name");
  var d = $(this).attr("data-name");
  var e = ( d * 9 ) - 8 
  var f = ( d * 9 ) + 1

  $("#binder").empty();
  // defines array for the AJAX requests to go into
  var allMyAjax = [];
  // For loop to run through 9 times
  for (e; e < f; e++) {
    // Qquery URL based on what is being requested
    var queryURL = "https://api.scryfall.com/cards/" + c + "/" + e;
    // Pushes all the AJAX requests into that blank array
    allMyAjax.push($.ajax({
      method: 'GET',
      url: queryURL
    }));
  };
  //Waits for the allMyAjax array to be done
  Promise.all(allMyAjax)
    // runs this function AFTER the array is full
    .then(function (responses) {
      // run through the now-completed array in a loop
      for (var i = 0; i < responses.length; i++) {
        // Display the responses in the binder in the proper order
        fetchMTG(responses[i]);
      }
    });
}

// grab a 9-item range of cards from a set and display them
function showPage() {
  // defines the set to view based on the thumbnail image's attribute
  var a = $(".toView").attr("data-name");
  // empties the binder out before doing anything else
  $("#binder").empty();
  // defines array for the AJAX to go into
  var allMyAjax = [];
  // For loop to run through 9 times
  for (var i = 1; i < 10; i++) {
    // Qquery URL based on what is being requested
    var queryURL = "https://api.scryfall.com/cards/" + a + "/" + i;
    // Pushes all the AJAX requests into that blank array
    allMyAjax.push($.ajax({
      method: 'GET',
      url: queryURL
    }));
  };
  //Waits for the allMyAjax array to be done
  Promise.all(allMyAjax)
    // runs this function AFTER the array is full
    .then(function (responses) {
      // run through the now-completed array in a loop
      for (var i = 0; i < responses.length; i++) {
        // Display the response in the binder
        fetchMTG(responses[i]);
      }
    });
}



