// default display array
// let cards = ["Black Lotus", "Mox Pearl", "Mox Sapphire", "Mox Jet", "Mox Ruby", "Mox Emerald", "Time Walk", "Timetwister", "Ancestral Recall",];

//"Fun" learning-themed array
let cards = ["Accumulated Knowledge", "Riptide Director", "Learn from the Past", "Mystical Tutor", "Tolarian Academy", "Azami Lady of Scrolls", 
            "Pursuit of Knowledge", "Minamo School at Waters Edge", "Master Transmuter"];

//Function that adds default cards to the binder on page load
const renderBinder = () => {
  for (let i = 0; i < cards.length; i++) {
    $.ajax({
      method: 'GET',
      url: "https://api.scryfall.com/cards/named?fuzzy=" + cards[i]

    }).then( (response) => {
      console.log(response)
      fetchMTG(response)
    });
  }
}

renderBinder();

//CLEAR BUTTON
$("#clear").on("click", (event) => {
  event.preventDefault();
  $("#binder").empty();
});

// ADD BUTTON
$("#add").on("click", getCard);

//UNDO BUTTON
$("#undo").on("click", (event) => {
  event.preventDefault();
  $('#binder img').last().remove();
});

//Function to get card name froom user input and put it in the binder 
const getCard = (event) => {
  event.preventDefault();

  $.ajax({
    url: "https://api.scryfall.com/cards/named?fuzzy=" + $("#cardName").val().trim(),
    method: "GET"
  }).then((response) => {
    fetchMTG(response)
  });
}

const fetchMTG = (item) => {
  // Defines the card response as a letiable
  let image = $("<img>").attr({ "data-toggle": "modal", "data-target": "#viewCard", "data-name": item.name, "class": "mtg cardPad", "src": item.image_uris.small });
  // Puts the card art in that element
  $("#binder").append(image);
}

// CLICK CARDS ANYWHERE ON THE PAGE
$(document).on("click", ".mtg", viewCard);

// CARD VIEWER FEATURE
const viewCard = (event) => {
  event.preventDefault();
// This fixes viewer issue but only in set view, not in "free-view" - needs and if/else 
//  + "&set=" + $(".toView").attr("data-name");
  $.ajax({
    url: "https://api.scryfall.com/cards/named?fuzzy=" + $(this).attr("data-name"),
    method: "GET"
  }).then((response) => {
    // Creates an image Element
    let image = $("<img>").attr("src", response.image_uris.large);
    // Puts the card art in that element
    $("#viewer").html(image);
  });
}

// ADD Set BUTTON
$("#addSet").on("click", getSet);

// UNDO Set Button
$("#undoSet").on("click", (event) => {
  event.preventDefault();
  $('#setList img').last().remove();
});

//CLEAR Set BUTTON
$("#clearSet").on("click", (event) => {
  event.preventDefault();
  $("#setList").empty();
  $("#binder").empty();
  $("#ring").empty();
  $("#infoTab").empty();
  renderBinder();
});

//AJAX to grab the set and add it to the set database
const getSet = (event) => {
  event.preventDefault();

  $.ajax({
    url: "https://api.scryfall.com/sets/" + $("#setName").val().trim(),
    method: "GET"
  }).then((response) => {
    //Set Symbol as a clickable button with attributes
    let setSymbol = $("<img>").attr({ "src": response.icon_svg_uri, "alt": response.name, "class": "symClean set", "data-name": response.code })
    //Add it to the Page
    $("#setList").append(setSymbol)
    fetchSet(response)
  });
}

// CLICK SETS ANYWHERE ON THE PAGE
$(document).on("click", ".set", viewSet);

//CLICK PAGE TABS ANYWHERE ON THE PAGE
$(document).on("click", ".setBtn", fetchPage);

const viewSet = (event) => {
  event.preventDefault();

  $.ajax({
    url: "https://api.scryfall.com/sets/" + $(this).attr("data-name"),
    method: "GET"
  }).then((response) => {
    fetchSet(response)
  });
}

const fetchSet = (box) => {
  // gets 1 page per 9 cards, rounded up
  //Sends title, icon, name and info to the summary viewer at the top
  $("#nowShowing").text("Now Viewing: " + box.name)
  $("#detInfo").text(box.card_count + " Cards, Released " + box.released_at)
  $("#setThumb").attr({ "src": box.icon_svg_uri, "alt": box.name, "class": "toView symTiny", "data-name": box.code })
  //Empty the binder 
  $("#binder").empty();
  //Empty the binder ring
  $("#ring").empty();
  //Makes "Page" buttons on the binder when a set is searched 
  for (let i = 0; i < Math.ceil(box.card_count / 9); i++) {
    //Makes button a letiable 
    let pageBtn = $("<button>").attr({ "data-name": i + 1, "class": "btn btn-secondary setBtn" });
    // Adds number attr to the page button
    // Puts a number on the button
    pageBtn.text(i + 1);
    // Adds the button to the binder ring
    $("#ring").append(pageBtn);
  }
  showPage();
}

const fetchPage = () => {
// fetches a specific "page" of the binder based on the set currently being viewed, and the page number 
  let c = $(".toView").attr("data-name");
  let d = $(this).attr("data-name");
  let e = ( d * 9 ) - 8 
  let f = ( d * 9 ) + 1

  $("#binder").empty();
  // defines array for the AJAX requests to go into
  let allMyAjax = [];
  // For loop to run through 9 times
  for (e; e < f; e++) {
    // Pushes all the AJAX requests into that blank array
    allMyAjax.push($.ajax({
      method: 'GET',
      url: "https://api.scryfall.com/cards/" + c + "/" + e
    }));
  };
  //Waits for the allMyAjax array to be done
  Promise.all(allMyAjax)
    // runs this function AFTER the array is full
    .then((responses) => {
      // run through the now-completed array in a loop
      for (let i = 0; i < responses.length; i++) {
        // Display the responses in the binder in the proper order
        fetchMTG(responses[i]);
      }
    });
}

// grab a 9-item range of cards from a set and display them
const showPage = () => {
  // defines the set to view based on the thumbnail image's attribute
  let a = $(".toView").attr("data-name");
  // empties the binder out before doing anything else
  $("#binder").empty();
  // defines array for the AJAX to go into
  let allMyAjax = [];
  // For loop to run through 9 times
  for (let i = 1; i < 10; i++) {
    // Pushes all the AJAX requests into that blank array
    allMyAjax.push($.ajax({
      method: 'GET',
      url: "https://api.scryfall.com/cards/" + a + "/" + i
    }));
  };
  //Waits for the allMyAjax array to be done
  Promise.all(allMyAjax)
    // runs this function AFTER the array is full
    .then((responses) => {
      // run through the now-completed array in a loop
      for (let i = 0; i < responses.length; i++) {
        // Display the response in the binder
        fetchMTG(responses[i]);
      }
    });
}



