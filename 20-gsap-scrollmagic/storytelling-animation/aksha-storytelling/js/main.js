$(function () {

  var master = new TimelineMax();

  (function arrowAnimation() {
    var tl = new TimelineMax();
    tl.to('#arrow', 0.5, {
      y: '-5%',
      yoyo: true,
      repeat: -1
    });
    return tl;
  }());

  function clockAnimation() {
    // Clock Animation
    TweenMax.from('#clock-hand3', 20, {
      rotation: '360_ccw',
      transformOrigin: "top 50%",
      repeat: -1,
      ease: 'linear'
    });
  }

  function frame1to4() {
    var tl = new TimelineMax();

    // Frame 1 Animation
    tl.from('#f1-ground', 1, {
        y: $(window).height()
      })
      .staggerFrom(
        [
          '#f1-house3',
          '#f1-tree2',
          '#f1-tree3',
          '#f1-house6',
          '#f1-house1',
          '#f1-tree1',
          '#f1-tree4',
          '#f1-house2',
          '#f1-house5',
          '#f1-tree5',
          '#f1-tree6',
          '#f1-tree7',
          '#f1-house4'
        ], 1, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: 'center bottom',
          ease: Elastic.easeOut.config(1, 0.5)
        }, 0.15)
      .from('#f1-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .to('#f1-text1', 1, {
        opacity: 0
      }, '+=1')

    // Frame 2 Animation
    tl.from('#f2-text1, #f2-text2', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .from('#f2-woman1', 1, {
        x: -$(window).width()
      }, '-=1')
      .from('#f2-woman2, #f2-woman3, #f2-woman4', 1, {
        x: $(window).width()
      }, '-=1')
      .to('#f2-women, #f2-texts', 1, {
        opacity: 0
      }, '+=1')

    // Frame 3 Animation
    tl.from('#f3-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .from('#f3-woman1', 1, {
        x: -$(window).width()
      }, '-=1')
      .from('#f3-woman2', 1, {
        x: $(window).width()
      }, '-=1')
      .to('#f3, #bg1-3', 1, {
        opacity: 0
      }, '+=1')

    // Frame 4 Animation 
    tl.from('#f4-ground1', 1, {
        y: $(window).height()
      })
      .staggerFrom(
        [
          '#f4-tree1',
          '#f4-tree4',
          '#f4-house1',
          '#f4-tree3',
          '#f4-tree5',
          '#f4-tree2',
        ], 1, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: 'center bottom',
          ease: Elastic.easeOut.config(1, 0.5)
        }, 0.15
      )
      .from('#f4-woman1', 1, {
        x: -$(window).width()
      })
      .from('#f4-woman2', 1, {
        x: $(window).width()
      }, '-=1')
      .to('#f4', 1, {
        opacity: 0
      }, '+=1')

    return tl;
  }

  function frame5to8() {
    var tl = new TimelineMax();

    clockAnimation();

    // Frame 5 Animation
    tl.from('#f5-ground', 1, {
        y: $(window).height()
      })
      .from('#f5-bed', 1, {
        x: -$(window).width()
      })
      .from('#f5-clock, #f5-window', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      }, '-=1')
      .from('#f5-kitchen-window', 1, {
        x: $(window).width()
      }, '-=1')
      .from('#f5-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .from('#f5-husband-wife', 1, {
        x: $(window).width()
      }, "-=1")
      .to('#f5-husband-wife', 1, {
        opacity: 0
      }, "+=1")

    // Frame 6 Animation
    tl.from('#f6-husband-wife', 1, {
        x: -$(window).width()
      })
      .from('#f6-woman1', 1, {
        x: $(window).width()
      }, '-=1')
      .to('#f5-text1, #f6-women', 1, {
        opacity: 0
      }, "+=1")

    // Frame 7 Animation
    tl.from('#f7-woman1, #f7-woman2, #f7-msgbox, #f7-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .to('#f7-texts', 1, {
        opacity: 0
      }, "+=1")


    // Frame 8 Animation
    tl.from('#f8', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .to('#f7-woman2-hand', 1, {
        rotation: '30_cw',
        transformOrigin: 'top right'
      }, '-=1')
      .to('#f8, #f5-kitchen-window', 1, {
        opacity: 0
      }, "+=1")

    return tl;
  }

  function frame9to12() {
    var tl = new TimelineMax();

    // Frame 9 Animation
    tl.from('#f9-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .from('#f9-think-bubble', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'right center',
        ease: Elastic.easeOut.config(1, 0.5)
      }, '-=1')
      .to('#f9', 1, {
        opacity: 0
      }, '+=1')

    // Frame 10 Animation
    tl.from('#f10-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .from('#f10-think-bubble', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'right center',
        ease: Elastic.easeOut.config(1, 0.5)
      }, '-=1')
      .to('#f10-think-bubble', 1, {
        opacity: 0
      }, '+=1')

    // Frame 11 Animation
    tl.from('#f11-think-bubble', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'right center',
        ease: Elastic.easeOut.config(1, 0.5)
      }, '-=1')
      .to('#f11-think-bubble', 1, {
        opacity: 0
      }, '+=1')

    // Frame 12 Animation
    tl.from('#f12-think-bubble', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'right center',
        ease: Elastic.easeOut.config(1, 0.5)
      }, '-=1')
      .to('#f5, #f7, #f10, #f12', 1, {
        opacity: 0
      }, '+=1')

    return tl;
  }

  function frame13to16() {
    var tl = new TimelineMax();

    // Frame 13 Animation
    tl
      .from('#f13-ground', 1, {
        y: $(window).height()
      })
      .from('#f13-crack1', 1, {
        scale: 0,
        transformOrigin: "center top",
      })
      .from('#f13-crack2', 1, {
        scale: 0,
        transformOrigin: "center bottom",
      }, '-=1')
      .from('#f13-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center center',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .to('#f13', 1, {
        opacity: 0
      }, '+=1')

    // Frame 14 Animation
    tl
      .from('#f14-text', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .staggerFrom(
        [
          '#f14-circle1',
          '#f14-text1',
          '#f14-circle2',
          '#f14-text2',
          '#f14-circle3',
          '#f14-text3',
          '#f14-circle4',
          '#f14-text4',
        ], 1, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: 'center center',
          ease: Elastic.easeOut.config(1, 0.5)
        }, 0.15)
      .to('#f14, #f14-text', 1, {
        opacity: 0
      }, '+=1')

    // Frame 15 Animation
    tl
      .from('#f15-ground', 1, {
        y: $(window).height()
      })
      .staggerFrom(
        [
          '#f15-hut1',
          '#f15-hut3',
          '#f15-tree1',
          '#f15-hut5',
          '#f15-tree3',
          '#f15-hut2',
          '#f15-hut4',
          '#f15-tree2',
          '#f15-tree4',
        ], 1, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: 'center center',
          ease: Elastic.easeOut.config(1, 0.5)
        }, 0.15)
      .from('#f15-woman1', 1, {
        x: -$(window).width()
      })
      .from('#f15-woman2', 1, {
        x: $(window).width()
      }, '-=1')
      .from('#f15-text1', 1, {
        opacity: 0,
        scale: 0,
        transformOrigin: 'center center'
      }, '-=1')
      .to('#f15', 1, {
        opacity: 0
      }, '+=1')

    // Frame 16 Animation
    tl.from('#f16-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .to('#f16-text1', 1, {
        opacity: 0
      }, '+=1')

    return tl;
  }

  function frame17to18() {
    var tl = new TimelineMax();

    // Frame 17 Animation
    tl.from('#f17-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .staggerFrom(
        [
          '#f17-female1',
          '#f17-arrow1',
          '#f17-female2',
          '#f17-arrow2',
          '#f17-female3',
          '#f17-arrow3',
          '#f17-female4',
          '#f17-arrow4',
          '#f17-female5',
        ], 1, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: 'center center',
          ease: Elastic.easeOut.config(1, 0.5)
        }, 0.15)
      .to('#f17', 1, {
        opacity: 0
      }, '+=1')

    // Frame 18 Animation
    tl.from('#f18-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .staggerFrom(
        [
          '#f18-arrow1',
          '#f18-circle1',
          '#f18-arrow2',
          '#f18-circle2',
          '#f18-arrow3',
          '#f18-circle3',
        ], 1, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: 'center center',
          ease: Elastic.easeOut.config(1, 0.5)
        }, 0.15)
      .from('#f18-india', 1, {
        opacity: 0,
        scale: 0,
        transformOrigin: 'center bottom',
        ease: Power2.easeIn
      })
      .to('#f18', 1, {
        opacity: 0
      }, '+=1')

    return tl;
  }

  function frame19to20() {
    var tl = new TimelineMax();

    // Ambulance Tyre Animation
    TweenMax.from('#f19-tyre1, #f19-tyre2', 1, {
      rotation: '360_ccw',
      transformOrigin: "center center",
      repeat: -1,
      ease: 'linear'
    });

    // Frame 19 Animation
    tl.from('#f19-ground', 1, {
        y: $(window).height()
      })
      .staggerFrom(
        [
          '#f19-hospital',
          '#f19-tree1',
          '#f19-tree2',
        ], 1, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: 'center center',
          ease: Elastic.easeOut.config(1, 0.5)
        }, 0.15)
      .from('#f19-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .from('#f19-ambulance', 1, {
        x: $(window).width() + 700,
        ease: 'easein'
      }, '-=1')
      .from('#f19-woman1, #f19-woman2', 1, {
        x: -$(window).width(),
      })
      .from('#f19-woman3, #f19-woman4', 1, {
        x: $(window).width(),
      })
      .to('#f19', 1, {
        opacity: 0
      }, '+=1')

    // Frame 20 Animation
    tl.from('#f20-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center center',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .to('#f20-text1', 1, {
        opacity: 0
      }, '+=1')

    return tl;
  }

  function frame21to22() {
    var tl = new TimelineMax();

    // Frame 21 Animation
    tl.from('#f21-ground', 1, {
        y: $(window).height()
      })
      .staggerFrom(
        [
          '#f21-home1',
          '#f21-home3',
          '#f21-tree1',
          '#f21-tree3',
          '#f21-home2',
          '#f21-tree2',
          '#f21-tree4',
        ], 1, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: 'center center',
          ease: Elastic.easeOut.config(1, 0.5)
        }, 0.15)
      .from('#f21-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .from('#f21-woman1, #f21-woman2, #f21-woman3', 1, {
        x: -$(window).width(),
      }, '-=1')
      .from('#f21-woman4, #f21-woman5', 1, {
        x: $(window).width(),
      }, '-=1')
      .to('#f21-text1', 1, {
        opacity: 0
      }, '+=1')

    // Frame 22 Animation
    tl.from('#f22-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center center',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .to('#f21-women, #f22-text1', 1, {
        opacity: 0
      }, '+=1')

    return tl;
  }

  function frame23to24() {
    var tl = new TimelineMax();

    // Frame 23 Animation
    tl.from('#f23-tree1', 1, {
        x: -$(window).width(),
      })
      .from('#f23-tree2', 1, {
        x: $(window).width(),
      }, '-=1')
      .from('#f23-stage', 1, {
        y: $(window).height(),
      }, '-=1')
      .from('#f23-rocks', 1, {
        y: $(window).height(),
      })
      .staggerFrom(
        [
          '#f23-woman8',
          '#f23-woman7',
          '#f23-woman6',
          '#f23-woman5',
          '#f23-woman4',
          '#f23-woman3',
          '#f23-woman2',
          '#f23-woman1',
        ], 1, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: 'center center',
          ease: Elastic.easeOut.config(1, 0.5)
        }, 0.15)
      .from('#f23-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .from('#f23-woman9', 1, {
        x: $(window).width(),
      }, '-=1')
      .to('#f23-text1', 1, {
        opacity: 0
      }, '+=1')

    // Frame 24 Animation
    tl.from('#f24-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center center',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .staggerTo(
        [
          '#f23-woman8-hand',
          '#f23-woman6-hand',
          '#f23-woman4-hand',
          '#f23-woman1-hand',
        ], 1, {
          rotation: '245_ccw',
          transformOrigin: '20% top',
          ease: 'linear'
        }, 0.15)
      .to('#f23, #f24-text1', 1, {
        opacity: 0
      }, '+=1')

    return tl;
  }

  function frame25to27() {
    var tl = new TimelineMax();

    // Frame 25 Animation
    tl.from('#f25-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .from('#f25-woman1', 1, {
        x: -$(window).width(),
      }, '-=1')
      .from('#f25-woman2', 1, {
        x: $(window).width(),
      }, '-=1')
      .to('#f25', 1, {
        opacity: 0
      }, '+=1')

    // Frame 26 Animation
    tl.from('#f26-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .from('#f26-woman1', 1, {
        x: -$(window).width(),
      }, '-=1')
      .from('#f26-woman2', 1, {
        x: $(window).width(),
      }, '-=1')
      .to('#f26, #f21-home1, #f21-home2, #f21-home3, #f21-tree1, #f21-tree2, #f21-tree3, #f21-tree4', 1, {
        opacity: 0
      }, '+=1')

    // Frame 27 Animation
    tl.from('#f27-text1', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center bottom',
        ease: Elastic.easeOut.config(1, 0.5)
      })
      .set('#f14, #frame13to16', {
        opacity: 1,
        zIndex: 1
      })
      .set('#frame25to27', {
        zIndex: 2
      })
      .set('#f14-text1, #f14-text2, #f14-text3, #f14-text4', {
        opacity: 0,
      })
      .from('#f14-circle1, #f14-circle2, #f14-circle3, #f14-circle4', 1, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: 'center center',
        ease: Elastic.easeOut.config(1, 0.5),
        immediateRender: false
      })
      .to('#f14-circle1', 1, {
        x: -100,
        scale: 0.8,
        transformOrigin: 'center center',
      })
      .to('#f14-circle2', 1, {
        x: -200,
        scale: 0.8,
        transformOrigin: 'center center',
      }, '-=1')
      .to('#f14-circle3', 1, {
        x: 200,
        scale: 0.8,
        transformOrigin: 'center center',
      }, '-=1')
      .to('#f14-circle4', 1, {
        x: 100,
        scale: 0.8,
        transformOrigin: 'center center',
      }, '-=1')
      .from('#f27-woman1', 1, {
        x: -$(window).width(),
        zIndex: 2
      })
      .from('#f27-woman2', 1, {
        x: $(window).width(),
      }, '-=1')
      .to('#f27', 1, {
        opacity: 0
      }, '+=1')

    return tl;
  }


  // Adding Animation to the master Timeline 
  master.add(frame1to4());
  master.add(frame5to8());
  master.add(frame9to12());
  master.add(frame13to16());
  master.add(frame17to18());
  master.add(frame19to20());
  master.add(frame21to22());
  master.add(frame23to24());
  master.add(frame25to27());

  console.log(master.duration());

  // ScrollMagic 
  var ctrl = new ScrollMagic.Controller();

  var scene = new ScrollMagic.Scene({
      triggerElement: '#frames',
      duration: 40000,
      triggerHook: 0,
      reverse: true
    })
    .setTween(master)
    .setPin('#frames')
    .addIndicators()
    .addTo(ctrl);

});