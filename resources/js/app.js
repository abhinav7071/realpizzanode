import axios from 'axios';
import moment from 'moment';
import Noty from 'noty';
import { initAdmin } from './admin'

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

//Remove alert messafe on X seconds
const alertMsg = document.querySelector('#success-alert'); 
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    },2000)
}


//Call Admin js file
//initAdmin();

//Change order status
let statuses =  document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? document.querySelector('#hiddenInput').value : null ; 
order = JSON.parse(order);
let time = document.createElement('small');
//console.log(order);


function updateStatus(order){
    //remove previous classes and add new clasess
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status ;
        if(stepCompleted){
            status.classList.add('step-completed');
        }

        if(dataProp === order.status){
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A');  
            status.appendChild(time);
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current');
            }
            
        }
    })
}

updateStatus(order)
//Socket
let socket = io();
initAdmin(socket);

//Join
//agr order hh to...
if(order){
    socket.emit('join',`order_${order._id}`);//ye socket ek msg bhejega server pe join naam ka usme oder_id(837e8rwr8w)(order_38278423784) jayegi
}

//identify krenge ki admin ka url h ya ni..admin ko room me join krne k liye
let adminAreaPath = window.location.pathname;
if(adminAreaPath.includes('admin')){
    socket.emit('join','adminRoom')
}

//console.log(adminAreaPath);//check admin url in browser
socket.on('orderUpdated',(data) => {

    const updatedOrder ={...order};//order ki copy banayege aur modify krke data bhejeneg
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    //console.log(data);//yaha pe update data mil jayenge bina page refresh kiya...fir updateStatus function call kr denge page me color vahgaira change krne k liye aur line ko aage badhane kk liye od=rder vali
    updateStatus(updatedOrder);
    new Noty({
        type : 'success',
        timeout:1000,
        text : 'Order updated..!!',
        progressBar: false
    }).show()

    
})



//