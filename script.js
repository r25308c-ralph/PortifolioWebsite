const menuicon=document.querySelector('.menu-icon');
const navlinks=document.querySelector('.nav-links');

menuIcon.onclick=()=>{
    navlinks.classList.toggle('active');
}
const hamburger=document.querySelector('.hamburger-icon');
const navMenu=document.querySelector('.nav-menu');

hamburger.addEventListener('click',()=>{
    navMenu.classList.toggle('active');
})