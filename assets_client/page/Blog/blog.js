$(document).ready(function () {
    $.get("/Home/GetBlogByTag", { tag: tag }, function (data) {
        $("#contentBlog").html(data)
        $('.conetentblog').each(function (index, item) {
            var txt = $(this).text();
            if (txt.length > 200)
                $(this).text(txt.substr(0, 200) + '.....');
        })
    })
    
    
});