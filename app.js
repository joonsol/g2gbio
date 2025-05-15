document.addEventListener('DOMContentLoaded', () => {
  //1 ScrollTrigger 플러그인을 GSAP에 등록
  gsap.registerPlugin(ScrollTrigger);

  //2. keyword  헤더 요소와 스크롤 래퍼를 선택
  const pageScrollWrap = document.querySelector('.page-scroll-wrap')
  const header = document.querySelector('header')
  const hdNavBtn = document.querySelector('.hd-nav-btn')
  const gnbWrap = document.querySelector('.gnb')
  const gnbList = document.querySelectorAll('.gnb>li')
  const lnbList = document.querySelectorAll('.lnb')


  // hero
  const heroSlPlayBtn = document.querySelector('.control-wrap>div.play')
  const heroSlStopBtn = document.querySelector('.control-wrap>div.stop')








  // 11gnbList mouseenter

  gnbList.forEach((gnb, i) => {
    gnb.addEventListener('mouseenter', () => {
      console.log(i)
      const menuNum = i + 1;

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
          opacity: 1,
          duration: .4,
          ease: 'power1.inOut'
        })
      }
      header.classList.add('nav-Active')
    })
  })

  // 12 mouseleave
  gnbWrap.addEventListener('mouseleave', () => {
    lnbList.forEach((lnb) => {
      lnb.style.display = 'none'
    })
    header.classList.remove('nav-Active')


  })


  //3 LocomotiveScroll 인스턴스 생성
  const locomoScroll = new LocomotiveScroll({
    el: pageScrollWrap,// 스크롤을 적용할 래퍼 요소
    smooth: true, // 부드러운 스크롤 활성화 (데스크탑)
    smoothMobile: true,
    paused: true,         // 스크롤을 초기에는 일시정지 (원하는 시점에 수동으로 시작 가능)
    onUpdate: () => {
      window.dispatchEvent(new Event('resize'))
    },
    multiplier: .8,
    smartphone: {
      smooth: true        // 모바일에서도 부드러운 스크롤 적용
    },
    tablet: {
      smooth: true        // 태블릿에서도 부드러운 스크롤 적용
    },
    useKeyboard: true     // 키보드 방향키로 스크롤 허용
  });




  //4 LocomotiveScroll이 스크롤 이벤트 발생시 ScrollTrigger에 갱신 신호를 전달
  locomoScroll.on('scroll', ScrollTrigger.update)


  //5. GSAP ScrollTrigger가 LocomotiveScroll을 인식할 수 있도록 연결(proxy 역할)
  ScrollTrigger.scrollerProxy(pageScrollWrap, {
    //5-1 ScrollTrigger에서 scrollTop 값을 설정하거나 가져올 때 사용되는 함수
    scrollTop(value) {
      //5-2 값을 전달받으면 → LocomotiveScroll에게 해당 위치로 스크롤하라고 명령
      if (arguments.length) {
        return locomoScroll.scrollTo(value, 0, 0)
      }

      //5-3 값을 전달받지 않으면 → 현재 스크롤 위치를 반환 (ScrollTrigger가 내부적으로 체크)
      return locomoScroll.scroll.instance.scroll.y;
    },
    // 5-4 ScrollTrigger가 사용할 뷰포트 크기 정보 제공
    getBoundingClientRect() {
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
  });


  //6 모든 설정이 완료되면 Scroll Trigger와 Loomotive Scroll을 업데이트!
  ScrollTrigger.addEventListener("refresh", () => locomoScroll.update());

  // 7.마지막으로Scroll Trigger가 refresh되도록 설정
  ScrollTrigger.refresh();


  // 8.hero 설정
  gsap.to('.hero', {
    scrollTrigger: {
      trigger: pageScrollWrap,
      scroller: pageScrollWrap,
      scrub: true,
      start: "+=2%",
      end: "+=70%"
    },
    opacity: 0
  })
  // 9.header scroll
  locomoScroll.on('scroll', (position) => {
    let i = position.delta.y
    // console.log(i);

    if (i > 0) {
      header.classList.add('isScroll')

    } else {
      header.classList.remove('isScroll')

    }
  })
  // 10. hdNavBtn
  hdNavBtn.addEventListener('click', () => {
    header.classList.toggle('allMenu-open')
  })


  // 13
  const heroSlider = new Swiper(".hero-slider", {
    effect: 'fade',
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    loop: true,
    navigation: {
      nextEl: '.hero-arr.right',
      prevEl: '.hero-arr.left'
    }
  });






  heroSlStopBtn.addEventListener('click', function() {
    fadeOut(this)
    fadeIn(heroSlPlayBtn)
    
    heroSlider.autoplay.stop()
  })
  
  heroSlPlayBtn.addEventListener('click', function() {
    
    fadeOut(this)
    fadeIn(heroSlStopBtn)
    heroSlider.autoplay.start()
  })


  function fadeIn(elem) {
    elem.style.display = 'block'
    elem.style.transition = 'opacity 0.5s'

    setTimeout(() => {
      elem.style.opacity = 1
    }, 10)
  }
  function fadeOut(elem) {
    elem.style.opacity = 0;
    elem.style.transition = 'opacity 0.5s'
    
    setTimeout(() => {
      elem.style.display = 'none'
    }, 500)
  }

// sc3 slider

const s3Slider = new Swiper('.s3_slider',{
  slidesPerView: 1,
  spaceBetween: 30,
  breakpoints:{
    499:{
      slidesPerView: 2,
      spaceBetween: 20,
      },
    768:{
      slidesPerView: 3,
      spaceBetween: 30,
      },
    1024:{
      slidesPerView: 4,
      spaceBetween: 30,
      },
    1270:{
      slidesPerView: 5,
      spaceBetween: 30,
      },
  },
  navigation: {
    nextEl: ".sc3 .swiper-button-next",
    prevEl: ".sc3 .swiper-button-prev",
  },
})

const langBtn =document.querySelector('.util>li:last-child>a')

// langBtn.addEventListener('click',()=>{
//   langBtn.classList.toggle('On')
// })
langBtn.addEventListener('click',function(){
  this.classList.toggle('On')
})

})//end