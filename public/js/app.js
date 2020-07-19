const navArrowUpBtn = document.querySelector('#nav-arrow-up')
const cardInfoElems = document.querySelectorAll('.card-info')

cardInfoElems.forEach(cardInfo => {
  cardInfo.addEventListener('click', event => {
    cardInfo.remove()
  })
})

window.onscroll = () => {
  if (document.body.scrollTop > 80 ||
    document.documentElement.scrollTop > 80) {
    navArrowUpBtn.classList.add('active')
  } else {
    navArrowUpBtn.classList.remove('active')
  }
}

navArrowUpBtn.addEventListener('click', event => {
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

  if (navArrowUpBtn.classList.contains('active'))
    navArrowUpBtn.classList.remove('active')
})