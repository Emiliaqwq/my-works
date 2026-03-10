document.addEventListener("DOMContentLoaded", function () {
    // 导航栏下滑
    const nav = document.querySelector("nav");
    if (nav) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 0) {
                nav.classList.add("active");
                nav.classList.remove("show");
            }
        });
    }

    // 导航栏上滑
    let lastScrollTop = 0;
    const navLogo = document.querySelector(".logo img");
    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset;
        if (scrollTop < lastScrollTop && navLogo) {
            // 增加校验
            nav?.classList.remove("active");
            nav?.classList.add("show");
            navLogo.src = "images/tencent-logo01.jpg";
        }
        lastScrollTop = scrollTop;
        if (window.scrollY === 0 && navLogo) {
            nav?.classList.remove("show");
            navLogo.src = "images/tencent-logo.jpg";
            nav?.classList.remove("active");
        }
    });

    // 搜索栏聚焦显示暗色蒙版
    const input = document.querySelector("nav input");
    const darkMask = document.querySelector(".dark-mask");
    if (input && darkMask) {
        // 增加校验
        input.addEventListener("focus", () => {
            darkMask.style.display = "block";
        });
        input.addEventListener("blur", () => {
            darkMask.style.display = "none";
        });
    }

    // 生成视频封面函数
    function setVideoPoster(videoElement) {
        if (!videoElement) return;
        const tempVideo = videoElement.src
            ? videoElement
            : document.createElement("video");
        const videoSrc = videoElement.src || videoElement?.dataset?.src;
        if (!videoSrc) return;

        tempVideo.src = videoSrc;
        tempVideo.muted = true;
        tempVideo.style.display = "none";
        if (tempVideo !== videoElement) {
            document.body.appendChild(tempVideo);
        }

        tempVideo.addEventListener("loadeddata", () => {
            const canvas = document.createElement("canvas");
            canvas.width = tempVideo.videoWidth;
            canvas.height = tempVideo.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
            const posterUrl = canvas.toDataURL("image/jpeg");
            // 仅当 video 没有设置 poster 时才赋值
            if (!videoElement.poster) {
                videoElement.poster = posterUrl;
            }

            if (tempVideo !== videoElement) {
                document.body.removeChild(tempVideo);
            }
            canvas.remove();
        });

        tempVideo.load();
    }

    const loadVideo = (videoElement) => {
        try {
            setVideoPoster(videoElement);
            const videoSrc = videoElement.dataset.src;
            if (!videoSrc) return;
            videoElement.preload = "metadata";
            videoElement.src = videoSrc;
            videoElement.load();
            // 加载完成后显示封面 + 准备播放
        } catch (error) {
            console.error("加载视频失败：", error);
        }
    };

    //  页面加载后延迟加载
    window.addEventListener("DOMContentLoaded", () => {
        // 所有延迟加载视频元素
        const asyncVideos = document.querySelectorAll("video[data-src]");
        // 延迟加载
        setTimeout(() => {
            asyncVideos.forEach((video) => {
                loadVideo(video);
            });
        }, 100);
    });

    // 轮播逻辑
    const videoCarousel = document.querySelector(".carousel");
    const videoItems = document.querySelectorAll(".carousel-item");
    const videoPrevBtn = document.querySelector(".prev");
    const videoNextBtn = document.querySelector(".next");
    let videoIndex = 0;
    let videoTimer = null;

    // 自动播放逻辑（防抖：切换时清除旧定时器）
    const autoPlay = () => {
        clearInterval(videoTimer); // 清除旧定时器，避免重复触发
        videoTimer = setInterval(() => {
            videoIndex = (videoIndex + 1) % (videoItems.length || 1);
            gotoVideo();
        }, 10000);
    };
    window.addEventListener("DOMContentLoaded", () => {
        autoPlay();
    });

    // 轮播切换核心函数（异步加载+性能优化）
    const gotoVideo = () => {
        if (videoItems.length === 0 || !videoCarousel) return;

        // 边界处理
        videoIndex = videoIndex % videoItems.length;
        if (videoIndex < 0) videoIndex = videoItems.length - 1;

        // 执行轮播动画
        videoCarousel.style.transform = `translateX(-${videoIndex * 101}%)`;

        //  重启自动播放定时器（防抖）
        clearInterval(videoTimer);
        autoPlay();
    };

    // 绑定左右切换按钮事件
    if (videoPrevBtn) {
        videoPrevBtn.addEventListener("click", () => {
            videoIndex =
                (videoIndex - 1 + videoItems.length) % videoItems.length;
            gotoVideo();
        });
    }
    if (videoNextBtn) {
        videoNextBtn.addEventListener("click", () => {
            videoIndex = (videoIndex + 1) % videoItems.length;
            gotoVideo();
        });
    }

    // 第一屏左右切换按钮跟随鼠标移动
    const prev = document.querySelector(".prev");
    const prevContainer = document.querySelector(".prev-container");
    const next = document.querySelector(".next");
    const nextContainer = document.querySelector(".next-container");
    let isdrag = false;
    let offsetX = 0;
    let offsetY = 0;

    // 左按钮
    if (prev && prevContainer) {
        prev.addEventListener("mouseenter", (e) => {
            isdrag = true;
            offsetX = e.clientX - prev.offsetLeft;
            offsetY = e.clientY - prev.offsetTop;
        });
        prev.addEventListener("mousemove", (e) => {
            if (isdrag) {
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;
                if (
                    newLeft >= 0 &&
                    newLeft <= 80 &&
                    newTop >= 0 &&
                    newTop <= 80
                ) {
                    prev.style.position = `absolute`;
                    prev.style.left = (e.clientX - offsetX) * 0.3 + "px";
                    prev.style.top = (e.clientY - offsetY) * 0.3 + "px";
                } else {
                    isdrag = false;
                }
            }
        });
        prevContainer.addEventListener("mouseleave", () => {
            isdrag = false;
            prev.style.position = "relative";
            prev.style.left = "0";
            prev.style.top = "0";
        });
    }

    // 右按钮
    if (next && nextContainer) {
        next.addEventListener("mouseenter", (e) => {
            isdrag = true;
            offsetX = e.clientX - next.offsetLeft;
            offsetY = e.clientY - next.offsetTop;
        });
        next.addEventListener("mousemove", (e) => {
            if (isdrag) {
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;
                if (
                    newLeft >= 0 &&
                    newLeft <= 80 &&
                    newTop >= 0 &&
                    newTop <= 80
                ) {
                    next.style.position = `absolute`;
                    next.style.left = (e.clientX - offsetX) * 0.3 + "px";
                    next.style.top = (e.clientY - offsetY) * 0.3 + "px";
                } else {
                    isdrag = false;
                }
            }
        });
        nextContainer.addEventListener("mouseleave", () => {
            isdrag = false;
            next.style.position = "relative";
            next.style.left = "0";
            next.style.top = "0";
        });
    }

    // 为什么选择腾讯
    const iconTencent = document.querySelectorAll(".choose-icon ");
    iconTencent.forEach((item) => {
        item.addEventListener("mouseenter", () => {
            item.classList.add("active");
            setTimeout(() => {
                item.classList.remove("active");
            }, 6000);
        });
    });

    // 公司简介轮播图
    const imgCarousel = document.querySelectorAll(".img-carousel");
    const carouselLength = imgCarousel.length;
    const carouselStates = [];
    // 为每个轮播图定义状态，防止多个轮播图同时运行
    Array.from(imgCarousel).forEach(() => {
        carouselStates.push({
            imgIndex: 0,
            imgTimer: null,
        });
    });

    // 停止指定索引的轮播
    const stopCarousel = (index) => {
        if (index < 0 || index >= carouselStates.length) return;
        clearInterval(carouselStates[index].imgTimer);
        carouselStates[index].imgTimer = null;
    };

    // 停止所有轮播
    const stopAllCarousels = () => {
        imgCarousel.forEach((item, index) => {
            stopCarousel(index);
        });
    };

    // 启动指定索引的轮播
    const startCarousel = (index) => {
        if (index < 0 || index >= imgCarousel.length) return;
        // 先停止当前轮播
        stopCarousel(index);
        const item = imgCarousel[index];
        const imgItems = item.querySelectorAll(".img-item");
        if (imgItems.length === 0) return; // 无轮播项直接返回

        const state = carouselStates[index];
        const gotoImg = () => {
            state.imgIndex = (state.imgIndex + 1) % imgItems.length; // 取模避免越界
            item.style.transform = `translateY(-${state.imgIndex * 100}%)`;
        };
        state.imgTimer = setInterval(gotoImg, 3000);
        gotoImg();
    };

    // 生成 0 ~ carouselLength-1 的随机整数（修复边界问题）
    const getRandomIndex = () => {
        if (carouselLength === 0) return -1;
        return Math.floor(Math.random() * carouselLength);
    };

    // 每隔一定间隔随机切换轮播图
    let globalTimer = null;
    if (carouselLength > 0) {
        globalTimer = setInterval(() => {
            const randomIndex = getRandomIndex();
            if (randomIndex === -1) return;
            stopAllCarousels();
            startCarousel(randomIndex);
        }, 3000);
    }

    // 首次随机启动一个轮播图
    const autoStartCarousel = () => {
        if (carouselLength === 0) return;
        const randomIndex = getRandomIndex();
        if (randomIndex !== -1) {
            startCarousel(randomIndex);
        }
    };
    autoStartCarousel();

    // 员工心声轮播图
    const employeeCarouselContainer = document.querySelector(
        ".employee-carousel-container",
    );
    const employeeCarousel = document.querySelector(".employee-carousel");
    const employeeCarouselItems = document.querySelectorAll(".employee-item");
    const employeePrevBtn = document.querySelector(".employ-btn.prev.icon");
    const employeeNextBtn = document.querySelector(".employ-btn.next.icon");
    let currentItem = 0;
    let employeeTimer = null;

    const autoStart = () => {
        if (employeeCarouselItems.length === 0) return;
        clearInterval(employeeTimer);
        employeeTimer = setInterval(() => {
            currentItem = (currentItem + 1) % employeeCarouselItems.length;
            gotoIndex();
        }, 3000);
    };
    if (employeeCarouselItems.length > 0) autoStart();

    if (employeeCarouselContainer) {
        employeeCarouselContainer.addEventListener("mouseenter", () => {
            clearInterval(employeeTimer);
        });
        employeeCarouselContainer.addEventListener("mouseleave", () => {
            autoStart();
        });
    }

    const nextItem = () => {
        currentItem = (currentItem + 1) % employeeCarouselItems.length;
        gotoIndex();
        clearInterval(employeeTimer);
        autoStart();
    };
    const prevItem = () => {
        currentItem =
            (currentItem - 1 + employeeCarouselItems.length) %
            employeeCarouselItems.length;
        gotoIndex();
        clearInterval(employeeTimer);
        autoStart();
    };

    if (employeePrevBtn) employeePrevBtn.addEventListener("click", prevItem);
    if (employeeNextBtn) employeeNextBtn.addEventListener("click", nextItem);

    const gotoIndex = () => {
        if (employeeCarouselItems.length === 0 || !employeeCarousel) return;
        currentItem = Math.max(
            0,
            Math.min(currentItem, employeeCarouselItems.length - 1),
        );
        employeeCarousel.style.transform = `translateX(-${currentItem * 100}%)`;
    };

    // 点击底部中文简体出现子菜单
    const chineseBtn = document.querySelector(".language");
    if (chineseBtn) {
        const chineseSubMenu = chineseBtn.querySelector(".sub");
        chineseBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            chineseSubMenu?.classList.toggle("active"); // 可选链容错
        });
        document.addEventListener("click", (e) => {
            if (
                chineseSubMenu &&
                !chineseBtn.contains(e.target) &&
                !chineseSubMenu.contains(e.target)
            ) {
                chineseSubMenu.classList.remove("active");
            }
        });
    }

    // 点击侧边栏关闭按钮关闭侧边栏
    const closeBtn = document.querySelector(".close-btn");
    const sidebar = document.querySelector(".sidebar");
    if (closeBtn && sidebar) {
        closeBtn.addEventListener("click", () => {
            sidebar.classList.add("hide");
        });
    }

    // 点击首屏播放按钮显示视频窗口
    const playBtn = document.querySelectorAll(".video-text .icon");
    const videoMask = document.querySelector(".video-mask");
    const videoCloseBtn = document.querySelector(".video-mask .icon");
    if (playBtn.length > 0 && videoMask && videoCloseBtn) {
        playBtn.forEach((item) => {
            item.addEventListener("click", (e) => {
                e.stopPropagation();
                videoMask.classList.add("show");
            });
        });
        videoCloseBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            videoMask.classList.remove("show");
        });
        document.addEventListener("click", (e) => {
            if (!videoMask.contains(e.target)) {
                videoMask.classList.remove("show");
            }
        });
    }
});
