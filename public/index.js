const $ = (s) => document.querySelector(s)
const $$ = (s) => document.querySelectorAll(s)

let isMenuShown = false

$('#hamburger').addEventListener('click', () => {
    if (isMenuShown) {
        isMenuShown = false
        $('menu').style = "display: none"
    }
    else {
        isMenuShown = true
        $('menu').style = "display: flex"
    }
})