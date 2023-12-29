seemoreEl = document.querySelectorAll(".seemore")
descriptionEl = document.querySelectorAll(".description")
caretEl = document.querySelectorAll(".caret1")
hrefEl = document.querySelectorAll(".href")
inputEl = document.querySelector(".input1");
secbarEl = document.querySelector(".bar-row")



for (let i = 0; i < seemoreEl.length; i++) {
    // const element = array[i];
    seemoreEl[i].addEventListener("mouseover", ()=>{
        descriptionEl[i].style.visibility = "visible";
    })

    caretEl[i].addEventListener("click", ()=>{
        descriptionEl[i].style.visibility = "hidden";
    })

    descriptionEl[i].addEventListener("mouseout", ()=>{
        descriptionEl[i].style.visibility = "hidden";
    })
}


inputEl.addEventListener("input", ()=>{
    if(inputEl.checked){
        // secbarEl.style.visibility = "hidden";
        secbarEl.style.transform = "scaleY(1)";
    }
    else{
        // secbarEl.style.visibility = "visible";
        secbarEl.style.transform = "scaleY(0)";
    }
});

secbarEl.addEventListener("mouseout", ()=>{
    secbarEl.style.transform = "scaleY(0)";
});

secbarEl.addEventListener("mouseover", ()=>{
    secbarEl.style.transform = "scaleY(1)";
});





for (let j = 0; j < hrefEl.length; j++) {
    hrefEl[j].addEventListener("click", ()=>{
        var productId = hrefEl[j].dataset.product
        // var action = hrefEl[j].dataset.action
        // console.log("productId:", productId, "Action:", action)

        if(user === 'AnonymousUser'){
            console.log('Not logged in')
            // addCookieItem(productId, action)
        }
        else{
            updateUserOrder(productId, action)
            // console.log("User is logged in, sending data...")
        }
        // console.log('USER:', user)
    })
    
}

function updateUserOrder (productId, action){
    console.log("user is logged in, sending data...")

    var url = 'update_item'

    fetch(url, {
        method: 'POST', 
        headers:{
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body:JSON.stringify({'productId': productId, 'action': action}) 
    })
    .then((response) =>{
        return response.json()
    })

    .then((data) =>{
        console.log('data', data)
        location.reload()
    })
}