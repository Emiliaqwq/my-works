// 获取轮播元素
const carousel = document.querySelector(".carousel-container");
const carouselItems = document.querySelectorAll(".carousel-item");
const dotsContainer = document.querySelector(".carousel-dots");
const carouselMask = document.querySelector(".carousel-mask");
let currentIndex = 0;
let interval = 3000;
let timer = null;

carouselItems.forEach((item, index) => {
    const dot = document.createElement("li");
    if (index === 0) {
        dot.classList.add("active");
    }
    dotsContainer.appendChild(dot);
    dot.addEventListener("click", () => {
        currentIndex = index;
        goToIndex();
    });
});

//鼠标移入停止播放
carousel.addEventListener("mouseover", () => {
    clearInterval(timer);
});

//鼠标移出开始播放
carousel.addEventListener("mouseout", () => {
    autoStart();
});

const autoStart = () => {
    timer = setInterval(() => {
        currentIndex++;
        if (currentIndex >= carouselItems.length) {
            currentIndex = 0;
        }
        goToIndex();
    }, interval);
};
//自动播放
autoStart();
const goToIndex = () => {
    carouselItems.forEach((item, index) => {
        // 给当前索引项显示，其他隐藏
        if (index === currentIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
    dotsContainer.querySelectorAll("li").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });
    carouselMask.style.backgroundImage = `url(beauty-0${currentIndex + 1}.jpg)`;
};

// // hover到热门榜单上显示书的详情
// const rankListItems = document.querySelectorAll(".rank-list li");
// const allActiveRankItems = document.querySelectorAll(".rank-item.active");
// rankListItems.forEach((item) => {
//     const rankItems = item.querySelectorAll(".rank-item");

//     item.addEventListener("mouseenter", (e) => {
//         rankItems.forEach((item) => {
//             // allActiveRankItems.forEach((activeItem) => {
//             //     activeItem.classList.remove("show");
//             // });
//             if (item.classList.contains("active")) {
//                 item.classList.add("show");
//             } else {
//                 item.classList.remove("show");
//             }
//         });
//     });
//     item.addEventListener("mouseleave", (e) => {
//         const parentList = item.closest(".rank-list");
//         // 检查鼠标离开后是否移开ul
//         if (parentList.contains(e.relatedTarget)) {
//             rankItems.forEach((rankItem) => {
//                 if (rankItem.classList.contains("active")) {
//                     rankItem.classList.remove("show");
//                 } else {
//                     rankItem.classList.add("show");
//                 }
//             });
//         }
//     });
// });

// 高度为900px时显示侧边栏的回到顶部按钮,并回到顶部
const toTopBtn = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
    if (window.scrollY > 900) {
        toTopBtn.classList.add("show");
    } else {
        toTopBtn.classList.remove("show");
    }
});

toTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});
