document.querySelectorAll(".slideshow").forEach(initSlide)

function initSlide(slideshow){
    const slideshowInner = slideshow.querySelector(".inner");
    const slideItems = slideshow.querySelectorAll(".slide-item");
    const controls = slideshow.querySelector(".controls");

    const items = 2;
    let isAnimating = false;
    createLoopSlides();

    const newSlideItems = slideshow.querySelectorAll(".slide-item");
    let currentIndex = items;
    const maxIndex = newSlideItems.length - items;

    updateSlider(true)
    setupSlides();

    controls.onclick = handleControls;

    slideshowInner.ontransitionend = handleTransitionEnd;

    createNav();

    // ===========================

    function createLoopSlides (){
        const slidesArray = Array.from(slideItems);
        const cloneHead = slidesArray.slice(-items).map( slide => slide.cloneNode(true))
        const cloneTail = slidesArray.slice(0, items).map( slide => slide.cloneNode(true))
    
        slideshowInner.prepend(...cloneHead);
        slideshowInner.append(...cloneTail);
    }
    
    function setupSlides(){
        newSlideItems.forEach( slide => {
            slide.style.flexBasis = `calc(100% / ${items})`;
        })
    }

    function handleControls(event){
        if(isAnimating) return;

        const ctrBtn = event.target;

        if(ctrBtn.matches('.prev')){
            currentIndex--;
        }   
        if(ctrBtn.matches('.next')){
            currentIndex++;
        }

        isAnimating = true;
        updateSlider()
    }
    
    function handleTransitionEnd() {
        if(currentIndex <= 0){
            currentIndex = maxIndex - items;
            updateSlider(true)
        }else if(currentIndex === maxIndex ){
            currentIndex = items;
            updateSlider(true)
        }
        isAnimating = false;
    }

    function createNav() {
        const  elementNav = document.createElement("div");
        elementNav.className = "slide-nav";

        const slideCount = slideItems.length;
        const pageCount = Math.ceil(slideCount / items);

        for(let i = 0; i < pageCount; i++){
            const dot = document.createElement("button");
            dot.className = "slide-dot";

            if(i === 0) dot.classList.add("active");

            dot.onclick = (event, index) => {
                currentIndex = i * items + items;

                updateNav();
                updateSlider();
            }

            elementNav.appendChild(dot)
        }

        slideshow.appendChild(elementNav)
    }
    
    function updateSlider(instant = false) {
        slideshowInner.style.transition =
            instant
                ? "none"
                : "all 0.3s ease";

        const offset =
            -(currentIndex * (100 / items));

        slideshowInner.style.transform =
            `translateX(${offset}%)`;

        if (!instant) {
            updateNav();
        }
    }

    function updateNav(){
        const dots = slideshow.querySelectorAll(".slide-dot");

        let realIndex = currentIndex - items;

        // if(realIndex < 0){
        //     realIndex = slideItems.length - items;
        // }
        const pageIndex = Math.floor(realIndex / items);

        dots.forEach((dot, index) => {
            dot.classList.toggle(
                "active",
                index === pageIndex
            );
        });
    }
}




