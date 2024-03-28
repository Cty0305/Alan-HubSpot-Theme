// swiper.js
import gsap from "gsap";
import Swiper from "swiper/bundle";

const initSwiper = () => {
  const isTouchDevice =
    /MSIE 10.*Touch/.test(navigator.userAgent) ||
    "ontouchstart" in window ||
    (window.DocumentTouch && document instanceof DocumentTouch);

  if (document.querySelectorAll(".banner").length) {
    document.querySelectorAll(".banner").forEach(function(holder) {
      const swiperElm = holder.querySelector(".swiper--banner");
      const links = holder.querySelectorAll(".tab-item a");
      const autoplayDuration = 6000;
      let tl;

      if (!swiperElm) return;
      const swiper = new Swiper(swiperElm, {
        loop: false,
        effect: "fade",
        allowTouchMove: false,
        fadeEffect: {
          crossFade: true,
        },
        pagination: {
          el: holder.querySelector(".swiper-pagination"),
          clickable: true,
        },
        navigation: {
          nextEl: holder.querySelector(".swiper-button-next"),
          prevEl: holder.querySelector(".swiper-button-prev"),
        },
        on: {
          init: function() {
            const slider = this;
            links[0].classList.add("active");
            const video = slider.slides[slider.activeIndex].querySelector(
              "video"
            );
            var videoDuration = video
              ? video.duration * 1000
              : autoplayDuration;
            if (video) {
              var promise = video.play();
              if (promise !== undefined) {
                promise.then((_) => {}).catch((error) => {});
              }
            }
            tl = gsap.fromTo(
              links[0].querySelector(".banner__decor"),
              { width: "0%" },
              {
                width: "100%",
                duration: videoDuration / 1000,
                ease: "linear",
                onComplete: function() {
                  const totalSlides = slider.slides.length;
                  slider.slideTo(
                    slider.activeIndex == totalSlides - 1
                      ? 0
                      : slider.activeIndex + 1,
                    300,
                    true
                  );
                },
              }
            );
          },
        },
      });

      swiper.on("slideChange", function() {
        links.forEach((link) => {
          link.classList.remove("active");
        });
        links[swiper.activeIndex].classList.add("active");
        tl.progress(0);
        tl.pause();
        const video = swiper.slides[swiper.activeIndex].querySelector("video");
        var videoDuration = video ? video.duration * 1000 : autoplayDuration;
        if (video) {
          video.play();
        }
        tl = gsap.fromTo(
          links[swiper.activeIndex].querySelector(".banner__decor"),
          { width: "0%" },
          {
            width: "100%",
            duration: videoDuration / 1000,
            ease: "linear",
            onComplete: function() {
              const totalSlides = swiper.slides.length;
              swiper.slideTo(
                swiper.activeIndex == totalSlides - 1
                  ? 0
                  : swiper.activeIndex + 1,
                300,
                true
              );
              tl.progress(0);
            },
          }
        );
      });

      links.forEach((link, i) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          swiper.slideTo(i, 300, true);
        });
      });
    });
  }

  if (document.querySelectorAll(".visual__swiper").length) {
    document.querySelectorAll(".visual__swiper").forEach(function(holder) {
      if (holder.querySelectorAll(".swiper-slide").length == 1) return;
      const visualSwiper = new Swiper(holder, {
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: holder.querySelector(".swiper-pagination"),
          clickable: true,
        },
        navigation: {
          nextEl: holder.querySelector(".swiper-button-next"),
          prevEl: holder.querySelector(".swiper-button-prev"),
        },
      });
    });
  }

  if (document.querySelectorAll(".swiper--essential").length) {
    document.querySelectorAll(".swiper--essential").forEach(function(el) {
      const wrapper = el.querySelector(".swiper-wrapper");
      const curIndexElm = el
        .closest(".container")
        .querySelector(".swiper__current");
      console.log(el.closest(".container"));
      const totalElm = el.closest(".container").querySelector(".swiper__total");
      const slides = el.querySelectorAll(".swiper-slide");
      const progressBar = el
        .closest(".container")
        .querySelector(".swiper__progress-inner");
      const autoplayDuration = 8000;
      var breakpoint = window.matchMedia("(min-width: 768px)");
      let tl;
      const essentialSwiper = new Swiper(el, {
        loop: el.querySelectorAll(".swiper-slide").length > 3 ? true : false,
        spaceBetween: 12,

        pagination: {
          el: el.querySelector(".swiper-pagination"),
          clickable: true,
        },

        navigation: {
          nextEl: el.closest(".container").querySelector(".swiper-button-next"),
          prevEl: el.closest(".container").querySelector(".swiper-button-prev"),
        },

        breakpoints: {
          768: {
            spaceBetween: 16,
            slidesPerView: 3,
          },

          1440: {
            spaceBetween: 48,
            slidesPerView: 3,
          },
        },

        on: {
          init: function() {
            const total = this.slides.length - this.loopedSlides * 2;
            totalElm.innerText = ("0" + total).slice(-2);
            curIndexElm.innerHTML = ("0" + 1).slice(-2);

            tl = gsap.fromTo(
              progressBar,
              { width: "0%" },
              {
                width: "100%",
                duration: autoplayDuration / 1000,
                ease: "linear",
                onComplete: function() {
                  const totalSlides =
                    essentialSwiper.slides.length -
                    essentialSwiper.loopedSlides * 2;
                  essentialSwiper.slideNext();
                  tl.progress(0);
                },
              }
            );
          },
        },
      });

      essentialSwiper.on("slideChange", function() {
        tl.progress(0);
        curIndexElm.innerHTML = (
          "0" + parseInt(essentialSwiper.realIndex + 1)
        ).slice(-2);
      });

      el.addEventListener("mouseenter", (e) => {
        if (!isTouchDevice) {
          tl.pause();
        }
      });

      el.addEventListener("mouseleave", (e) => {
        if (!isTouchDevice) {
          tl.play();
        }
      });

      function resizeHandler() {
        if (breakpoint.matches) {
          if (slides.length > 3) {
            el.classList.remove("swiper-disabled");
            tl.play();
          } else {
            el.classList.add("swiper-disabled");
            tl.pause();
          }
        } else {
          if (slides.length > 1) {
            el.classList.remove("swiper-disabled");
            tl.play();
          } else {
            el.classList.add("swiper-disabled");
            tl.pause();
          }
        }
      }
      resizeHandler();
      breakpoint.addListener(resizeHandler);
    });
  }

  if (document.querySelectorAll(".swiper--need").length) {
    document.querySelectorAll(".swiper--need").forEach(function(holder) {
      if (holder.querySelectorAll(".swiper-slide").length == 1) return;
      const curIndexElm = holder.querySelector(".swiper__current");
      const totalElm = holder.querySelector(".swiper__total");
      const progressBar = holder.querySelector(".swiper__progress-inner");
      const autoplayDuration = 8000;
      const needSwiper = new Swiper(holder, {
        loop: true,
        autoHeight: true,
        pagination: {
          el: holder.querySelector(".swiper-pagination"),
          clickable: true,
        },
        navigation: {
          nextEl: holder.querySelector(".swiper-button-next"),
          prevEl: holder.querySelector(".swiper-button-prev"),
        },
        on: {
          init: function() {
            const total = this.slides.length - this.loopedSlides * 2;
            totalElm.innerText = ("0" + total).slice(-2);
            curIndexElm.innerHTML = ("0" + 1).slice(-2);

            tl = gsap.fromTo(
              progressBar,
              { width: "0%" },
              {
                width: "100%",
                duration: autoplayDuration / 1000,
                ease: "linear",
                onComplete: function() {
                  const totalSlides =
                    needSwiper.slides.length - needSwiper.loopedSlides * 2;
                  needSwiper.slideNext();
                  tl.progress(0);
                },
              }
            );
          },
        },
      });

      needSwiper.on("slideChange", function() {
        tl.progress(0);
        curIndexElm.innerHTML = (
          "0" + parseInt(needSwiper.realIndex + 1)
        ).slice(-2);
      });
    });
  }

  if (document.querySelectorAll(".choice__swiper").length) {
    document.querySelectorAll(".choice__swiper").forEach(function(holder) {
      const choiceSwiper = new Swiper(holder, {
        slidesPerView: "auto",
        spaceBetween: 36,
        initialSlide: 1,
        loop: true,
        autoplay: {
          delay: 1,
          disableOnInteraction: false,
        },
        allowTouchMove: false,
        disableOnInteraction: true,
        speed: 4000,
        breakpoints: {
          1200: {
            spaceBetween: 55,
          },
        },
      });
    });
  }

  if (document.querySelectorAll(".collab__swiper").length) {
    document.querySelectorAll(".collab__swiper").forEach(function(holder) {
      const collabSwiper = new Swiper(holder, {
        slidesPerView: 3,
        spaceBetween: -40,
        initialSlide: 1,
        loop: true,
        autoplay: {
          delay: 1,
          disableOnInteraction: false,
        },
        allowTouchMove: false,
        disableOnInteraction: true,
        speed: 4000,
        breakpoints: {
          768: {
            spaceBetween: 10,
            slidesPerView: 4,
          },

          1024: {
            spaceBetween: 10,
            slidesPerView: 6,
          },

          1200: {
            spaceBetween: 40,
            slidesPerView: 7,
          },
        },
      });
    });
  }

  if (document.querySelectorAll(".info-block--testimonial").length) {
    document
      .querySelectorAll(".info-block--testimonial")
      .forEach(function(holder) {
        const slideElm = holder.querySelectorAll(".swiper--testimonial");
        const container = holder.querySelector(".info__container");
        const tabsets = document.querySelectorAll(".info__links");
        const tabslider = holder.querySelectorAll(".swiper--tabset");
        const curIndexElm = holder.querySelector(".swiper__current");
        const totalElm = holder.querySelector(".swiper__total");
        const progressBar = holder.querySelector(".swiper__progress-inner");
        const autoplayDuration = 5000;
        let curTab = 0;
        let tl;

        tabslider.forEach((item) => {
          new Swiper(item, {
            slidesPerView: "auto",
            spaceBetween: 25,
          });
        });

        slideElm.forEach((slider, index) => {
          if (
            slider.querySelectorAll(":scope > .swiper-wrapper > .swiper-slide")
              .length !== 1
          ) {
            const tabSlider = new Swiper(slider, {
              slidesPerView: 1,
              spaceBetween: 25,
              loop: true,
              pagination: {
                el: slider.querySelector(".swiper-pagination"),
                clickable: true,
              },
              on: {
                init: function() {
                  const total = this.slides.length - this.loopedSlides * 2;
                  totalElm.innerText = ("0" + total).slice(-2);
                  curIndexElm.innerHTML = ("0" + 1).slice(-2);

                  tl = gsap.fromTo(
                    progressBar,
                    { width: "0%" },
                    {
                      width: "100%",
                      duration: autoplayDuration / 1000,
                      ease: "linear",
                      onComplete: function() {
                        const totalSlides =
                          slideElm[curTab].swiper.slides.length -
                          slideElm[curTab].swiper.loopedSlides * 2;
                        slideElm[curTab].swiper.slideTo(
                          slideElm[curTab].swiper.realIndex == totalSlides
                            ? 0
                            : slideElm[curTab].swiper.realIndex + 2,
                          300,
                          true
                        );
                        tl.progress(0);
                      },
                    }
                  );
                  tl.progress(0);
                  tl.pause();
                  if (index != 0) return;
                  tl.play();
                  holder
                    .querySelector(".swiper__pagination")
                    .classList.remove("--hide");
                },
              },
            });
            tabSlider.on("slideChange", function() {
              tl.progress(0);
              curIndexElm.innerHTML = (
                "0" + parseInt(tabSlider.realIndex + 1)
              ).slice(-2);
            });
          }
        });

        holder
          .querySelector(".swiper-button-prev")
          .addEventListener("click", (e) => {
            e.preventDefault();
            slideElm[curTab].swiper.slideTo(
              slideElm[curTab].swiper.realIndex == 0
                ? 3
                : slideElm[curTab].swiper.realIndex
            );
            tl.progress(0);
          });

        holder
          .querySelector(".swiper-button-next")
          .addEventListener("click", (e) => {
            e.preventDefault();
            const totalSlides =
              slideElm[curTab].swiper.slides.length -
              slideElm[curTab].swiper.loopedSlides * 2;
            slideElm[curTab].swiper.slideTo(
              slideElm[curTab].swiper.realIndex == totalSlides
                ? 0
                : slideElm[curTab].swiper.realIndex + 2,
              300,
              true
            );
            tl.progress(0);
          });

        if (tabsets.length) {
          window.addEventListener("click", (e) => {
            if (e.target.tagName == "A" && e.target.closest(".info__links")) {
              e.preventDefault();
              const targetID = e.target.getAttribute("href");
              if (document.querySelector(targetID)) {
                var currentItem = document.querySelector(targetID);
                currentItem.classList.add("active");
                getSiblings(currentItem).forEach((tab) => {
                  tab.classList.remove("active");
                });
                const i = [
                  ...e.target.closest(".info__links").querySelectorAll("a"),
                ].findIndex((c) => c == e.target);
                curTab = i;
                if (slideElm[curTab].swiper != undefined) {
                  holder
                    .querySelector(".swiper__pagination")
                    .classList.remove("--hide");
                  const total =
                    slideElm[curTab].swiper.slides.length -
                    slideElm[curTab].swiper.loopedSlides * 2;
                  totalElm.innerText = ("0" + total).slice(-2);
                  curIndexElm.innerHTML = ("0" + 1).slice(-2);
                  tl.progress(0);
                  tl.play();
                } else {
                  tl.pause();
                  tl.progress(0);
                  holder
                    .querySelector(".swiper__pagination")
                    .classList.add("--hide");
                }
              }
            }
          });
        }
      });
  }

  if (document.querySelectorAll(".swiper--team").length) {
    document.querySelectorAll(".swiper--team").forEach(function(el) {
      const breakpoint = window.matchMedia("(max-width: 767px)"); // Change to max-width

      const breakpointChecker = function() {
        if (breakpoint.matches === true) {
          if (!el.swiperInstance) {
            el.swiperInstance = new Swiper(el, {
              loop: true,
              slidesPerView: 1.07,
              spaceBetween: 10,
              pagination: {
                el: el.querySelector(".swiper-pagination"),
                clickable: true,
              },
            });
          }
        } else {
          if (el.swiperInstance) {
            el.swiperInstance.destroy(true, true);
            el.swiperInstance = undefined;
          }
        }
      };

      breakpointChecker();

      breakpoint.addListener(breakpointChecker);
    });
  }
  if (document.querySelectorAll(".swiper--fragment").length) {
    document.querySelectorAll(".swiper--fragment").forEach(function(holder) {
      const curIndexElm = holder.querySelector(".swiper__current");
      const totalElm = holder.querySelector(".swiper__total");
      const progressBar = holder.querySelector(".swiper__progress-inner");
      const autoplayDuration = 5000;

      const fragmentSwiper = new Swiper(holder, {
        slidesPerView: 1.08,
        spaceBetween: 16,
        pagination: {
          el: holder.querySelector(".swiper-pagination"),
          clickable: true,
        },
        loop: true,
        breakpoints: {
          768: {
            slidesPerView: 2,
          },

          1024: {
            spaceBetween: 30,
            slidesPerView: 2,
          },

          1200: {
            spaceBetween: 48,
            slidesPerView: 2,
          },
        },
        navigation: {
          nextEl: holder.querySelector(".swiper-button-next"),
          prevEl: holder.querySelector(".swiper-button-prev"),
        },
        on: {
          init: function() {
            const total = this.slides.length - this.loopedSlides * 2;
            totalElm.innerText = ("0" + total).slice(-2);
            curIndexElm.innerHTML = ("0" + 1).slice(-2);
            const swiper = this;
            tl = gsap.fromTo(
              progressBar,
              { width: "0%" },
              {
                width: "100%",
                duration: autoplayDuration / 1000,
                ease: "linear",
                onComplete: function() {
                  const totalSlides =
                    swiper.slides.length - swiper.loopedSlides * 2;
                  swiper.slideTo(
                    swiper.realIndex == totalSlides ? 0 : swiper.realIndex + 3,
                    300,
                    true
                  );
                  tl.progress(0);
                },
              }
            );
          },
        },
      });

      fragmentSwiper.on("slideChange", function() {
        tl.progress(0);
        curIndexElm.innerHTML = (
          "0" + parseInt(fragmentSwiper.realIndex + 1)
        ).slice(-2);
      });
    });
  }

  let getSiblings = function(e) {
    let siblings = [];
    if (!e.parentNode) {
      return siblings;
    }
    let sibling = e.parentNode.firstChild;

    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== e) {
        siblings.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    return siblings;
  };
};
