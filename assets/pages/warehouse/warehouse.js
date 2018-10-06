$(document).ready(function () {
    function myFunction() {
        var input, filter, table, tr, td, i;
        input = document.getElementById("myInputSearch");
        filter = input.value.toUpperCase();
        table = document.getElementById("myTableWarehouse");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[2];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    $("#myInputSearch").on('keyup change', function () {
        myFunction()
    })
});