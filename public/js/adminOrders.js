document.addEventListener('DOMContentLoaded',buildPage);

function buildPage(){
    var counter = 0;
    let status = document.querySelectorAll(".status");
    let dualHose = document.querySelectorAll(".dualHose");
    for ( i in status ){
        if (status[i].innerHTML=="canceled"){status[i].style.color='red'}
        if (status[i].innerHTML=="pending"){status[i].style.color='blue'}
        if (status[i].innerHTML=="accepted"){status[i].style.color='green'}
        if (status[i].innerHTML=="completed"){
            status[i].style.color='orange';
            counter = counter + 1;
        }
        if (dualHose[i].innerHTML=="0"){dualHose[i].innerHTML="Όχι"}
            else{dualHose[i].innerHTML="Ναι"}
    }
}