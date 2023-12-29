containerEl = document.querySelector(".container");
popEl = document.querySelector(".pop-up");
btnEl = document.querySelector(".btn");
closeEl = document.querySelector(".close");

btnEl.addEventListener("click", ()=>{
    popEl.classList.add("active");
    containerEl.classList.add("active");

})
closeEl.addEventListener("click", ()=>{
    popEl.classList.remove("active");
    containerEl.classList.remove("active");

    
})