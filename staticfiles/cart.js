var updateEl = document.querySelectorAll(".update-cart")


for (let j = 0; j < updateEl.length; j++) {
    updateEl[j].addEventListener("click", ()=>{
        var productId = updateEl[j].dataset.product
        var action = updateEl[j].dataset.action
        console.log("productId:", productId, "Action:", action)

        if(user === 'AnonymousUser'){
            // console.log('Not logged in')
            alert("item added successfully")
            addCookieItem(productId, action)
            
        }
        else{
            updateUserOrder(productId, action)
            // console.log("User is logged in, sending data...")
        }
        console.log('USER:', user)
        alert("item added successfully")
    })
    
}


function addCookieItem(productId, action){
    console.log('Not logged in...')

    if (action == 'add'){
        if(cart[productId] == undefined){
            cart[productId] = {'quantity' : 1}
        }
        else{
            cart[productId]['quantity'] += 1
        }
    }
    if(action == 'remove'){
        cart[productId]['quantity'] -= 1
        
        if (cart[productId]['quantity'] <= 0){
            console.log("hey removed")
            delete cart[productId]
        }
    }
    // console.log('cart:', cart )
    document.cookie = 'cart=' + JSON.stringify(cart) + ";domain=;path=/"
    location.reload()
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