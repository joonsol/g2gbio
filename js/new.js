document.addEventListener('DOMContentLoaded', () => {

  //1 ScrollTrigger 플러그인을 GSAP에 등록
  gsap.registerPlugin(ScrollTrigger);

  //2. keyword  헤더 요소와 스크롤 래퍼를 선택
  const header = document.querySelector('header');
  const pageScrollWrap = document.querySelector('.page-scroll-wrap');

  const gnbWrap = document.querySelector('.gnb')
  const gnbList = document.querySelectorAll('.gnb>li')
  const lnbList = document.querySelectorAll('.lnb')
  const hdNavBtn = document.querySelector('.hd_nav_btn')

  //3 LocomotiveScroll 인스턴스 생성
  const locoScroll = new LocomotiveScroll({
    el: pageScrollWrap,   // 스크롤을 적용할 래퍼 요소
    smooth: true,         // 부드러운 스크롤 활성화 (데스크탑)
    smoothMobile: true,
    paused: true,         // 스크롤을 초기에는 일시정지 (원하는 시점에 수동으로 시작 가능)
    onUpdate: () => {
      // 스크롤 위치 갱신 시 window의 resize 이벤트를 강제로 발생시킴
      window.dispatchEvent(new Event('resize'));
    },
    multiplier: 0.8,      // 스크롤 속도 조절 (0.8배 느리게)
    smartphone: {
      smooth: true        // 모바일에서도 부드러운 스크롤 적용
    },
    tablet: {
      smooth: true        // 태블릿에서도 부드러운 스크롤 적용
    },
    useKeyboard: true     // 키보드 방향키로 스크롤 허용
  });

  //4 LocomotiveScroll이 스크롤 이벤트 발생시 ScrollTrigger에 갱신 신호를 전달
  locoScroll.on('scroll', ScrollTrigger.update);


  //5. GSAP ScrollTrigger가 LocomotiveScroll을 인식할 수 있도록 연결(proxy 역할)
  ScrollTrigger.scrollerProxy(pageScrollWrap, {

    //5-1 ScrollTrigger에서 scrollTop 값을 설정하거나 가져올 때 사용되는 함수
    scrollTop(value) {
      //5-2 값을 전달받으면 → LocomotiveScroll에게 해당 위치로 스크롤하라고 명령
      if (arguments.length) {
        return locoScroll.scrollTo(value, 0, 0);  // y값, offsetX, offsetY
      }

      //5-3 값을 전달받지 않으면 → 현재 스크롤 위치를 반환 (ScrollTrigger가 내부적으로 체크)
      return locoScroll.scroll.instance.scroll.y;
    },
    // 5-4 ScrollTrigger가 사용할 뷰포트 크기 정보 제공
    getBoundingClientRect() {
      // 현재 뷰포트의 위치와 크기 정보 반환
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },

    // pin 요소를 고정할 방식 지정
    //5-6 → transform 기반인지, fixed 기반인지 자동 판별
    pinType: pageScrollWrap.style.transform ? "transform" : "fixed"

  })

  //6 모든 설정이 완료되면 Scroll Trigger와 Loomotive Scroll을 업데이트!
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  // 마지막으로Scroll Trigger가 refresh되도록 설정
  ScrollTrigger.refresh();


  //7. hero gsap
  gsap.to(".hero", {
    scrollTrigger: {
      trigger: pageScrollWrap,
      scroller: pageScrollWrap,
      scrub: true,
      start: "+=2%",
      end: "+=70%",
    },
    opacity: 0,
  });

  gsap.to(".hero .scroll_btn", {
    scrollTrigger: {
        trigger: pageScrollWrap,
        scroller: pageScrollWrap,
        scrub: true,
        start: "+=0%",
        end: "+=30%",
    },
    opacity: 0,
});




  //8. header scroll
  locoScroll.on('scroll', (position) => {
    let i = position.delta.y

    console.log(i);

    if (i > 0) {
      header.classList.add('isScroll')
    }
    else {
      header.classList.remove('isScroll')

    }
  })


  //9. event header
  hdNavBtn.addEventListener('click',()=>{
    header.classList.toggle('allMenu-open')
  })
  //10 event gnb
  gnbList.forEach((gnbBtn, i) => {
    gnbBtn.addEventListener('mouseenter', () => {
      const menuNum = i + 1;

      header.classList.add('nav-Active')
      lnbList.forEach((lnb) => {
        lnb.style.display = 'none'
      })

      const targetLnb = document.querySelector(`.lnb.sub${menuNum}`)

      if (targetLnb) {
        targetLnb.style.display = 'block'

        const items = targetLnb.querySelector('.dep2')
        gsap.fromTo(items, {
          opacity: 0,
          x: '1rem'
        }, {
          x: 0,
          duration: .4,
          stagger: .1,
          ease: 'power1.inOut',

          opacity: 1,
        })

      }
    })
  })
// 11 lnb mouseleave
  gnbWrap.addEventListener('mouseleave', () => {
    lnbList.forEach((lnb) => {
      lnb.style.display = 'none'
    })
    header.classList.remove('nav-Active')
  })



  // hero slider
  const heroSlider = new Swiper(".heroSlider", {
    // autoplay: true,
    effect: 'fade',
    speed: 1000,
    pagination: {
        el: ".swiper-pagination",
        clickable:true
    },
    loop: {
        delay: 500,
        disableOnInteraction: false
    },

    navigation: {
        nextEl: ".hero_arr.arrRight",
        prevEl: ".hero_arr.arrLeft",
    },
    on: {
        activeIndexChange: function () {
            // console.log(this.realIndex + '번째 slide입니다.');
        }
    }
});

const visuStopBtn = document.querySelector('.hero .control_wrap .stop')
const visuPlayBtn = document.querySelector('.hero .control_wrap .play')

let autoplay;



function fadeOut(elem) {
  elem.style.transition = "opacity 0.5s";
  elem.style.opacity = 0;
  setTimeout(() => {
      elem.style.display = 'none';
  }, 500);
}

function fadeIn(elem) {
  elem.style.display = 'block';
  elem.style.transition = "opacity 0.5s";
  setTimeout(() => {
      elem.style.opacity = 1;
  }, 10); // 약간의 시간차를 줘야 transition이 적용
}

visuStopBtn.addEventListener('click', function () {
  fadeOut(this);
  fadeIn(visuPlayBtn);
  visuSlider.autoplay.stop();
});

visuPlayBtn.addEventListener('click', function () {
  fadeOut(this);
  fadeIn(visuStopBtn);
  visuSlider.autoplay.start();
});




})