// GET user info on page load
function personalizePage() {
    $.ajax("/api/user_data/", {
        type: "GET"
    }).then(function (response) {
        let id = response.id
        //fill out the user's profile section
        $(".profilePic").attr("src", response.profilePic);
        $(".userName").text(response.name);
        $("#userName").attr(`data-id="${response.id}`);
        $("#sender").text(response.id)
        $("#tradeWithProfilePic").attr("src", "./assets/mystery.png")

        getTrades(id);

        //Request the list of User's sets from Our API 
        $.ajax("/api/sets/" + id, {
            type: "GET"
        }).then(function (response) {
            // loop through the user's sets to populate the form options 
            for (let i = 0; i < response.length; i++) {
                $("#setTradeFrom").append(`<option data-id="${response[i].id}">${response[i].setName}</option>`)
            }
        })
    });
}
personalizePage();

// GET all OTHER users for the trade info form
function populateUsers() {
    $.ajax("/api/user_data/all", {
        type: "GET"
    }).then(function (response) {
        $("#tradeWith").empty();
        //loop through the user data and populate the trade section
        for (let i = 0; i < response.length; i++) {
            // show all other users except the user who is logged in
            if (response[i].name !== $("#userName").text()) {
                $("#tradeWith").append(`<option value="${response[i].id}">${response[i].name}</option>`)
            }
        }
    })
}
populateUsers();

// Select a User to trade with
// add their profile pic, and sets they own
$("form.tradeWith").on("submit", function (event) {
    event.preventDefault();
    $("#theyTrade").empty();
    let id = $("#tradeWith").val();

    $.ajax("/api/user_data/" + id, {
        type: "GET"
    }).then(function (response) {
        if (response.profilePic){
            $("#tradeWithProfilePic").attr("src", response.profilePic)
        }
        $("#receiver").text(response.id)
        $(".tradeWithName").text(response.name);
        $(".tradeWithName").attr(`data-id="${response.id}`);
        let id = response.id
        //Request the list of User's sets from Our API 
        $.ajax("/api/sets/" + id, {
            type: "GET"
        }).then(function (response) {
            $("#theirSets").empty();
            // loop through the user's sets to populate the form options 
            for (let i = 0; i < response.length; i++) {
                $("#theirSets").append(`<option data-id="${response[i].id}">${response[i].setName}</option>`)
            }
        })
    })
})
// After you select the trade with set
$("form.theirSets").on("submit", function (event) {
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
         for (let i=0; i < response.length; i++){
            $("#theyTrade").append(`<option>${response[i].name}</option>`)
         }
        });
    })
})

// After User selects THEIR set to trade from
$("form.mySets").on("submit", function (event) {
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
         for (let i=0; i < response.length; i++){
            $("#iTrade").append(`<option>${response[i].name}</option>`)
         }
        });
    })
})
// View All INCOMING trades 
function getTrades(receiverID) {
    console.log(receiverID)

    $.ajax("/api/trades/" + receiverID, {
        type: "GET"

    }).then(function (response) {
       console.log(response)
    })
}


// Submit a Trade
$("form.tradeForm").on("submit", function (event) {
    event.preventDefault();
    
    let tradeData = {
        iTrade : $("#iTrade").val(),
        theyTrade : $("#theyTrade").val(),
        message: "Let's trade!",
        sender: $("#sender").text(),
        receiver: $("#receiver").text()
    }

    $.ajax("/api/trades/", {
        type: "POST",
        data: tradeData

    }).then(function (response) {
        console.log(response)
        $("#iTrade").empty();
        $("#theyTrade").empty();
    })  
});