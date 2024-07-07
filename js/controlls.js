// ==========================================================
// ===================== TUTORIAL 📖📽️ =====================
// ==========================================================
let count = 0;
const slides = document.querySelectorAll('.tutorial .slide');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const skipBtn = document.querySelector('#skip');
const tutorial = document.querySelector('#tutorial');
const tutorialToggle = document.querySelector('.tutorial-toggle');

const siteVisited = localStorage.getItem('visited');
if (!siteVisited) {
    tutorial.classList.add('active');
    localStorage.setItem('visited', 'true');
}

tutorial.addEventListener('click', (e) => {
    if (e.target.classList.contains('tutorial')) {
        skipBtn.style.animation = ".2s shake 2 ease-in-out";
        setTimeout(() => {
            skipBtn.style.animation = "none";
        }, 1000);
    }
})
tutorialToggle.addEventListener('click', () => {
    tutorial.classList.add('active');
    count = 0;
    nextBtn.innerText = "next";
    prevBtn.classList.add('unactive');
    moveSlides(count);
})
skipBtn.addEventListener('click', () => {
    tutorial.classList.remove('active');
});

// Arranging one after one
slides.forEach((slide, index) => {
    slide.style.left = `${100 * index}%`;
});


nextBtn.addEventListener('click', () => {
    if (count == slides.length - 1) {
        tutorial.classList.remove('active');
        return;
    }
    count++;
    if (count == slides.length - 1) {
        nextBtn.innerText = "finish";
    }
    moveSlides(count);
    prevBtn.classList.remove('unactive');
});

prevBtn.addEventListener('click', () => {
    if (count == 0) {
        return;
    }
    nextBtn.innerText = "next";
    count--;
    if (count == 0) {
        prevBtn.classList.add('unactive');
    }
    moveSlides(count);
});

const dot = document.querySelector(".dots");
for (let i = 0; i < slides.length; i++) {
    dot.innerHTML += `<div class="dot ${i === 0 ? "active" : ""}"></div>`
}
const dots = document.querySelectorAll(".dot");

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        count = i;
        if (count == 0) {
            prevBtn.classList.add('unactive');
        }
        else if (count == slides.length - 1) {
            nextBtn.innerText = "finish";
        }
        else {
            prevBtn.classList.remove('unactive');
            nextBtn.innerText = "next";
        }
        moveSlides(count);
    })
})

function moveSlides(count) {
    dots.forEach(dot => {
        dot.classList.remove('active');
    })

    dots[count].classList.add('active');

    slides.forEach((slide) => {
        slide.style.transform = `translateX(${-count * 100}%)`;
    });
}

window.addEventListener('keydown', (e) => {
    if (e.keyCode == 37 || e.keyCode == 74) {
        prevBtn.click();
    }
    else if (e.keyCode == 39 || e.keyCode == 76) {
        nextBtn.click();
    }
})





// ==========================================================
// ====================== CLICK EVENTS ======================
// ==========================================================

const clearNavOption = () => {
    navOptions.forEach((option) => {
        option.classList.remove('active');
    })
}
const clearDropMenu = () => {

    document.querySelectorAll('.drop-menu').forEach((menu) => {
        menu.classList.remove('active');
    })
}

//NAVIGATION click 🔵👆
const navOptions = document.querySelectorAll('.nav-menu>li>a');
navOptions.forEach((option) => {
    option.addEventListener('click', () => {
        //clearify
        if (option.classList.contains('drop-toggle') && option.classList.contains('active')) {
            option.classList.remove('active');
            clearDropMenu();
            return;
        }
        clearNavOption();
        clearDropMenu();


        //adding 
        option.classList.add('active');

        if (option.classList.contains('drop-toggle')) {
            const dropMenu = option.nextElementSibling;
            dropMenu.classList.add('active');
        }
    })
})

//OUTSIZE CLICK 🚀👆
document.addEventListener('click', (event) => {
    if (!document.querySelector('.nav-menu').contains(event.target)) {
        clearNavOption();
        clearDropMenu();
    }
})

//'dropMenu' OPTION CLICK 📃👆
const dropMenus = document.querySelectorAll('.drop-menu');
const dropOptions = document.querySelectorAll('.drop-menu a');

const clearDropOption = () => {
    document.querySelectorAll('.drop-menu.active a').forEach(option => {
        option.classList.remove('active');
    })
}

var algorithm = '';
dropOptions.forEach((option) => {
    option.addEventListener('click', () => {
        //clearify
        clearDropOption();
        clearDropMenu();
        clearNavOption();

        //adding
        option.classList.add('active');

        if (document.querySelector('#algo').contains(option)) {
            let text = option.innerText;
            algorithm = text.split(' ')[0];
            visualizeBtn.innerText = `Visualize ${algorithm}`;
        }
    })
})


//========== GUIDE TOGGLE ⏬⏬

const guide = document.querySelector('.guide');
const guideToggle = document.querySelector('.guide-toggle');
guideToggle.addEventListener('click', () => {
    guide.classList.toggle('active');
})

document.addEventListener('click', (e) => {
    if (!guideToggle.contains(e.target))
        guide.classList.remove('active');

})





// ==========================================================
// ============== BUTTONS INTERATION 🟡👆 ==================
// ==========================================================

const clearPathBtn = document.querySelector('#clear-path');
const clearBoardBtn = document.querySelector('#clear-board');
const speedOptions = document.querySelectorAll('#speed .drop-menu a');

const fast_AnimateDelay = 7;
const normal_AnimateDelay = 10;
const slow_AnimateDelay = 50;
let delay = normal_AnimateDelay;

speedOptions.forEach((option) => {
    option.addEventListener('click', () => {
        let pickedSpeed = option.innerText;
        if (pickedSpeed === 'Fast') delay = fast_AnimateDelay;
        else if (pickedSpeed === 'Normal') delay = normal_AnimateDelay;
        else delay = slow_AnimateDelay;
    })
})


clearPathBtn.addEventListener('click', clearPath);
clearBoardBtn.addEventListener('click', clearBoard);
let wallToAnimate;
