// GET user and cloud info on page load
function personalizePage() {
    $.ajax("/api/user_data/", {
        type: "GET"
    }).then(function (response) {
        //fill out the user's profile section
        $("#profilePic").attr("src", response.profilePic);
        $("#userName").text(response.name);
        console.log(response);

        let blankRow = `<tr class="text-light">
        <td scope="col">.</td>
        <td scope="col">.</td>
        <td scope="col">.</td>
        <td scope="col">.</td>
        <td scope="col">.</td>
    </tr>`
        //append blank rows to the tables for aesthetics
        for (let i = 0; i < 6; i++) {
            $("#myCards").append(blankRow);
            $("#mySets").append(blankRow);
        }
    });
}
personalizePage();

// UPDATE PROFILE FORM
let updateForm = $("form.update");

updateForm.on("submit", function (event) {
    event.preventDefault();
    console.log("update");
})
