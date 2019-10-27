var tl = new TimelineMax({ repeat: -1, yoyo: true });

tl.to("path#start", 1.5, {
  x: "-10%",
  ease: Expo.easeInOut
});
tl.to(
  "path#start",
  2,
  {
    attr: {
      d:
        "M0,0H451c50.626,156.193-101.076,552.188-101.076,552.188s158.27,352.421,100,528.916c1.547.75-449.924.084-449.924.084Z",
      d:
        "M0,0H451s-.236,1077.538-1.076,1080.947c.173.179-449.924.241-449.924.241Z"
    },
    ease: Elastic.easeOut
  },
  "-=1"
);

// tl.duration(10);

var tl1 = new TimelineMax({ repeat: -1, yoyo: true });

tl1.to("path#start1", 1.5, {
  x: "-10%",
  ease: Expo.easeInOut
});
tl1.to(
  "path#start1",
  2,
  {
    attr: {
      d:
        "M0,0,199,1.521c.255-.1,198.889,1084.192,200,1081.218,1.547.75-399-1.551-399-1.551Z",
      d:
        "M0,0H399c.255-.1-1.115,1085.713,0,1082.739,1.547.75-399-1.551-399-1.551Z"
    },
    ease: Elastic.easeOut
  },
  "-=1"
);
