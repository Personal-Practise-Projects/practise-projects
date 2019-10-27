<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>AKSHA</title>
  <link rel="stylesheet" href="css/style.css">
</head>

<body>

  <section id="container">
    <div id="scroll-down">
      <p>Health workers are real people, helping other real people.<br>Here are stories of such people who have made a
        difference.</p>
      <hr>
      <p>Scroll down to meet Rubi didi & Hira.</p>
      <?php echo file_get_contents("svg/scroll.svg") ?>
    </div>

    <div id="frames">
      <div id="frame1to4">
        <?php echo file_get_contents("svg/1-4.svg") ?>
      </div>
  
      <div id="frame5to8">
        <?php echo file_get_contents("svg/5-8.svg") ?>
      </div>

      <div id="frame9to12">
        <?php echo file_get_contents("svg/9-12.svg") ?>
      </div>
      
      <div id="frame13to16">
        <?php echo file_get_contents("svg/13-16.svg") ?>
      </div>

      <div id="frame17to18">
        <?php echo file_get_contents("svg/17-18.svg") ?>
      </div>

      <div id="frame19to20">
        <?php echo file_get_contents("svg/19-20.svg") ?>
      </div>

      <div id="frame21to22">
        <?php echo file_get_contents("svg/21-22.svg") ?>
      </div>

      <div id="frame23to24">
        <?php echo file_get_contents("svg/23-24.svg") ?>
      </div>

      <div id="frame25to27">
        <?php echo file_get_contents("svg/25-27.svg") ?>
      </div>
    </div>
  </section>

  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TimelineMax.min.js"></script>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.14.2/TweenMax.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.3/ScrollMagic.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.3/plugins/animation.gsap.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.3/plugins/debug.addIndicators.js"></script>
  
  <script src="js/main.js"></script>
</body>

</html>