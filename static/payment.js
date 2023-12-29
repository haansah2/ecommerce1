
function payWithPaystack(e) {

    e.preventDefault();

    let handler = PaystackPop.setup({
        key: 'pk_test_60a4e3028a992a7898d9c724e563b8e60f96a22a', // Replace with your public key
        amount: parseFloat(total).toFixed(2),
        ref: "" + Math.floor(Math.random() * 1000000000 + 1), 
        onClose: function () {
            alert("Window closed.");
        },
        callback: function (response) {
            let message = "Payment complete! Reference: " + response.reference;
            alert(message);
        },
    });

    handler.openIframe();
}
