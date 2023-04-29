
eleObjs = {
    eleBody: document.querySelector('body'),
    eleBtn: document.querySelector('.searchBar .btn'),
    eleInputName: document.querySelector('.searchBar input'),
    eleCarousel: document.querySelector('.carousel'),
    eleImgContainer: document.querySelector('.imgContainer'),
    elePrev: document.querySelector('.carousel .icon-prev'),
    eleNext: document.querySelector('.carousel .icon-next'),
    eleImg: null,
    preUrl: null,
    page: {
        cursor: 1,
        total: 1
    }


}

cbObjs = {
    cbSearch : null,
    cbPagePrev: null,
    cbPageNext: null,
    cbMouseEnter: null,
    cbMouseLeave: null

}

const setKeyEvent = function () {

    eleObjs.eleInputName.addEventListener('keyup', function (evt) {
        if (evt.key === 'Enter' && eleObjs.eleInputName.value.trim().length) {
            fetchData()
        }
    })
    eleObjs.eleBody.addEventListener('keyup', function(evt){
        if(evt.key === 'ArrowLeft') {
            prevPage()
        }
        if(evt.key === 'ArrowRight') {
            nextPage()
        }
    })

    eleObjs.elePrev.addEventListener('click', prevPage);
    eleObjs.eleNext.addEventListener('click', nextPage);


}

const prevPage = function() {
    if(eleObjs.page.cursor > 1) {
        eleObjs.page.cursor--
    }
    fetchData()
}

const nextPage = function () {
    if(eleObjs.page.cursor < eleObjs.page.total) {
        eleObjs.page.cursor++
    }
    fetchData()
}


const fetchData = function () {

    const access_key = 'KTpHGs6kBplI2wcZ8Axmw9lWOClODr8MaRe_G9rROUk';
    const inputName = eleObjs.eleInputName.value.trim().toLowerCase() || 'flower'

    console.log(inputName)
    // let inputName = 'macbook'
    const url = `https://api.unsplash.com/search/photos?client_id=${access_key}&query=${inputName}&page=${eleObjs.page.cursor}&orientation=landscape`

    fetch(url)
        .then(res => res.json())
        .then(
            data => {
                console.log(data)
                renderImages(data.results)
                eleObjs.page.total = data.total_pages
            }

        )

}
const renderImages = function (arrImages) {
    // set background image with the new data got / results[0]
    let imgUrl = arrImages[0].urls.full
    document.body.style.background = `url(${imgUrl}) no-repeat center center fixed`
    createCarousel(arrImages)

}
const setImageSelected = function (eleImage) {
   let images = document.querySelectorAll('[data-index]');
   images.forEach(ele => ele.className = '');
   eleImage.className = 'selected';
   console.log(eleImage.className)
}

const updateBackgroundImage = function (imgUrl) {
    eleObjs.eleBody.style.background = `url('${imgUrl}') no-repeat center center fixed`
}


const createCarousel = function (arrImages) {
    eleObjs.eleImgContainer.innerHTML = '';

    for(let i = 0; i < arrImages.length; i++) {
        eleObjs.eleImg = document.createElement('img')
        eleObjs.eleImgContainer.appendChild(eleObjs.eleImg)
        eleObjs.eleImg.src = arrImages[i].urls.thumb
        eleObjs.eleImg.dataset.index = i;
        eleObjs.eleImg.dataset.url = arrImages[i].urls.full
        eleObjs.eleImg.addEventListener('click', function(evt) {
            // console.log('clicked ...')
            updateBackgroundImage(evt.target.dataset.url)
            setImageSelected(evt.target)
        })

        eleObjs.eleImg.addEventListener('mouseenter', function (eve) {
           let newUrl = eve.target.dataset.url

            // replace the background image temporarily
            if(!eleObjs.preUrl) {
                // save current image url before replacement
                let str = eleObjs.eleBody.style.background
                // console.log('str bkg:', str)
                let iStart = str.indexOf('"');
                let iEnd = str.indexOf('"', iStart + 1);
                str = str.slice(iStart + 1, iEnd);
                // console.log('str substr bkg:', str)
                eleObjs.preUrl = str
                updateBackgroundImage(newUrl)


            }

        })

        eleObjs.eleImg.addEventListener('mouseleave', function (evt) {
            if(eleObjs.preUrl) {
                updateBackgroundImage(eleObjs.preUrl)
                eleObjs.preUrl = null
            }

        })

    }
    // arrImages.forEach((element)=> eleImg.src = element.urls.full)//only show the last picture

}
fetchData()
eleObjs.eleBtn.addEventListener('click', fetchData)
// const cbSearch = function (eve)
setKeyEvent()


