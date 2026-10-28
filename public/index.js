const $ = (s) => document.querySelector(s)
const $$ = (s) => document.querySelectorAll(s)

let isMenuShown = false
const menu = $('menu')
const menuBackdrop = $('.menu-backdrop')

const setMenuShown = (isShown) => {
    isMenuShown = isShown
    menu.style.display = isShown ? 'flex' : 'none'
    menuBackdrop.hidden = !isShown
}

$('#hamburger').addEventListener('click', () => setMenuShown(!isMenuShown))
menuBackdrop.addEventListener('click', () => setMenuShown(false))