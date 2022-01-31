import axios from 'axios';
import Noty from 'noty';

let addToCart = document.querySelectorAll('.add-to-cart'); //sare add to cart k button array me a jyenge
let cartCounter = document.querySelector('#cartCounter'); 

addToCart.forEach((btn) => {
    btn.addEventListener('click',(e)=>{
        //console.log(e);
        let pizza =JSON.parse( btn.dataset.pizza);//data mil jeyege ise see har pizza h data-pizza call kr liya yaha...aur usko vapas Object me convert kr diya
        //console.log(pizza);
        updateCart(pizza);
    })
});

//Update Cart
function updateCart(pizza){
    axios.post('/update-cart',pizza).then(res => {
        //console.log(res);
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type : 'success',
            timeout:1000,
            text : 'Item added to cart..!!',
            progressBar: false
        }).show();
    }).catch(err => {
        new Noty({
            type : 'error',
            timeout:1000,
            text : 'Something went wrong..!!',
            progressBar: false
        }).show();
    });
}