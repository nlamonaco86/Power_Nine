$.get("/api/user_data").then(cloudData => {

    var myWidget = cloudinary.createUploadWidget({
        cloudName: cloudData.cloudUploadName, 
        uploadPreset: cloudData.cloudUploadPreset}, (error, result) => { 
        if (!error && result && result.event === "success") { 
            console.log('Done! Here is the image info: ', result.info);
            var imageUrl = result.info.secure_url;
            $.ajax({
                url: "/api/user_data",
                method: "PUT",
                data: { profilePic: imageUrl}
            })
            .then(() => {
                console.log("done!!!!");
                $('.profilePic').attr("src", imageUrl);
            });
        }
        }
    )
    
    document.getElementById("upload_widget").addEventListener("click", function(){
        myWidget.open();
    }, false);

});