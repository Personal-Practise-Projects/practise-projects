var tl = new TimelineMax({ repeat: -1 });

tl.from("#bowl", 1, { x: "-190", opacity: 0, ease: Power1.easeOut })
  .from(
    "#sushi-01",
    1,
    {
      y: "-250",
      opacity: 0,
      rotation: -70,
      transformOrigin: "center",
      ease: Bounce.easeOut
    },
    "-=.4"
  )
  .from(
    "#sushi-02",
    1,
    {
      y: "-250",
      opacity: 0,
      rotation: 70,
      transformOrigin: "center",
      ease: Bounce.easeOut
    },
    "-=.4"
  )
  .from(
    "#chopstick-01",
    0.4,
    {
      y: "-250",
      opacity: 0,
      rotation: 20,
      transformOrigin: "center",
      ease: Power1.easeOut
    },
    "-=.7"
  )
  .from(
    "#chopstick-02",
    0.4,
    {
      y: "-250",
      opacity: 0,
      rotation: 0,
      transformOrigin: "center",
      ease: Power1.easeOut
    },
    "-=.4"
  )
  .from(
    "#bg-01",
    1,
    {
      x: "-500",
      opacity: 0,
      transformOrigin: "center",
      ease: Power1.easeOut
    },
    "-=.6"
  )
  .from(
    "#bg-02",
    1,
    {
      x: window.innerWidth,
      opacity: 0,
      transformOrigin: "center",
      ease: Power1.easeOut
    },
    "-=1"
  )
  .from("h1", 1, {
    y: 200,
    opacity: 0,
    transformOrigin: "center",
    ease: Power1.easeOut
  });

tl.duration(7);
console.log("", tl.endTime());
