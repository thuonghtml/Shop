$(document).ready(function () {
    console.log(tag)
    $.get("/Home/GetBlogByTag", { tag: tag }, function (data) {
        $("#contentBlog").html(data)
    })
    
    
});