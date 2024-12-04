$(document).ready(function () {
  const lanternImages = [
    "img/lantern1.png",
    "img/lantern2.png",
    "img/lantern3.png",
    "img/lantern4.png",
  ];

  // 위로 올라가는 풍등 생성 (기존)
  function createLantern() {
    const randomImage =
      lanternImages[Math.floor(Math.random() * lanternImages.length)];
    const randomSize = Math.random() * 0.5 + 0.5;
    const randomSpeed = Math.random() * 5 + 5;
    const randomPosition = Math.random() * 100;

    const lantern = $('<img class="lantern">').attr("src", randomImage);
    lantern.css({
      width: `${randomSize * 70}px`,
      left: `${randomPosition}%`,
      bottom: "200px",
      animationDuration: `${randomSpeed}s`,
    });

    $(".sky").append(lantern);

    setTimeout(() => {
      lantern.remove();
    }, randomSpeed * 1000);
  }

  setInterval(createLantern, 500);

  // 흔들리는 풍등 생성
  function createSwingingLantern() {
    const randomImage =
      lanternImages[Math.floor(Math.random() * lanternImages.length)];

    // 원근감을 표현하기 위해 랜덤 크기 설정
    const randomSize = Math.random() * 0.4 + 0.7; // 크기 랜덤화
    const randomBottomPosition = Math.random() * 120 + 10; // bottom 위치 설정 (10~100px 범위)
    const randomLeftPosition = Math.random() * 100; // left 위치 설정 (0% ~ 100% 범위)

    const swingingLantern = $('<img class="swinging-lantern">').attr(
      "src",
      randomImage
    );
    swingingLantern.css({
      width: `${randomSize * 60}px`, // 크기 조정 (원근감을 위해 다양한 크기 설정)
      bottom: `${randomBottomPosition}px`, // 수직 위치 조정
      left: `${randomLeftPosition}%`,
    });

    // 클릭 이벤트 추가: 클릭하면 위로 날아가는 애니메이션 적용
    swingingLantern.on("click", function () {
      $(this).css({
        animation: "floatUpClicked 5s linear forwards", // 클릭 시 위로 날아가는 애니메이션
      });
    });

    $(".sky").append(swingingLantern);
  }

  // 고정된 흔들리는 풍등을 40개 생성 (개수 증가)
  for (let i = 0; i < 40; i++) {
    createSwingingLantern();
  }

  // 블러 처리된 천천히 올라가는 풍등을 여러 개 생성하는 함수
  function createBlurredLantern() {
    const randomImage =
      lanternImages[Math.floor(Math.random() * lanternImages.length)];
    const randomSize = Math.random() * 0.3 + 0.3; // 작은 크기 (0.3 ~ 0.6)
    const randomSpeed = Math.random() * 20 + 15; // 천천히 올라가도록 (15초 ~ 35초)
    const randomPosition = Math.random() * 100; // 화면 가로 위치 (0% ~ 100%)
    const randomBottomPosition = Math.random() * 200 + 200; // 화면 중간 위쪽에서 시작 (200px ~ 400px)

    const blurredLantern = $('<img class="blurred-lantern">').attr(
      "src",
      randomImage
    );
    blurredLantern.css({
      width: `${randomSize * 60}px`,
      left: `${randomPosition}%`,
      bottom: `${randomBottomPosition}px`, // 화면 위쪽에서 시작
      animation: `floatUpBlurred ${randomSpeed}s linear forwards`,
    });

    $(".sky").append(blurredLantern);

    // 일정 시간 지나면 요소 제거 (속도에 따라 애니메이션 완료 시점)
    setTimeout(() => {
      blurredLantern.remove();
    }, randomSpeed * 1000);
  }

  // 초기 블러 처리된 풍등을 20개 생성 (페이지 로드 시)
  function createInitialBlurredLanterns() {
    for (let i = 0; i < 20; i++) {
      createBlurredLantern(); // 기존 함수 재사용하여 초기 풍등 생성
    }
  }

  // 페이지 로드 시 블러 처리된 풍등을 화면 위쪽에 여러 개 생성
  createInitialBlurredLanterns();

  // 일정 간격으로 블러 처리된 천천히 올라가는 풍등 생성
  setInterval(function () {
    // 랜덤 개수 설정 (1 ~ 5개)
    const randomCount = Math.floor(Math.random() * 2) + 1;

    // 랜덤 개수만큼 블러 처리된 풍등 생성
    for (let i = 0; i < randomCount; i++) {
      createBlurredLantern();
    }
  }, 1000);

  var WIDTH = $(window).width();
  var HEIGHT = $(window).height();
  var MAX_PARTICLES = (WIDTH * HEIGHT) / 20000;
  var DRAW_INTERVAL = 60;
  var canvas = $("#pixie")[0];
  var context = canvas.getContext("2d");
  var gradient = null;
  var pixies = [];

  function setDimensions() {
    WIDTH = $(window).width();
    HEIGHT = $(window).height();
    MAX_PARTICLES = (WIDTH * HEIGHT) / 15000;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    console.log("Resize to " + WIDTH + "x" + HEIGHT);
  }

  setDimensions();
  $(window).on("resize", setDimensions);

  function Circle() {
    this.settings = {
      ttl: 5000,
      xmax: 0.8,
      ymax: 0.3,
      rmin: 7,
      rmax: 10,
      drt: 10,
    };

    this.reset = function () {
      this.x = WIDTH * Math.random();
      this.y = HEIGHT * Math.random();
      this.r = (this.settings.rmax - 1) * Math.random() + 1;
      this.dx =
        Math.random() * this.settings.xmax * (Math.random() < 0.5 ? -1 : 1);
      this.dy =
        Math.random() * this.settings.ymax * (Math.random() < 0.5 ? -1 : 1);
      this.hl =
        (this.settings.ttl / DRAW_INTERVAL) * (this.r / this.settings.rmax);
      this.rt = 0;
      this.settings.drt = Math.random() + 1;
      this.stop = Math.random() * 0.2 + 0.4;
    };

    this.fade = function () {
      this.rt += this.settings.drt;

      if (this.rt >= this.hl) {
        this.rt = this.hl;
        this.settings.drt = this.settings.drt * -1;
      } else if (this.rt < 0) {
        this.reset();
      }
    };

    this.draw = function () {
      var newo = this.rt / this.hl;
      context.beginPath();
      context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
      context.closePath();

      var cr = this.r * newo;
      gradient = context.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        cr < this.settings.rmin ? this.settings.rmin : cr
      );
      gradient.addColorStop(0.0, "rgba(84, 171, 255," + newo + ")");
      gradient.addColorStop(this.stop, "rgba(0, 71, 227," + newo * 0.4 + ")");
      gradient.addColorStop(1.0, "rgba(88, 121, 190,0)");
      context.fillStyle = gradient;
      context.fill();
    };

    this.move = function () {
      this.x += (1 - this.rt / this.hl) * this.dx;
      this.y += (1 - this.rt / this.hl) * this.dy;
      if (this.x > WIDTH || this.x < 0) this.dx *= -1;
      if (this.y > HEIGHT || this.y < 0) this.dy *= -1;
    };
  }

  function draw() {
    context.clearRect(0, 0, WIDTH, HEIGHT);

    for (var i = pixies.length; i < MAX_PARTICLES; i++) {
      pixies.push(new Circle());
      pixies[i].reset();
    }

    for (var i = 0; i < MAX_PARTICLES; i++) {
      pixies[i].fade();
      pixies[i].move();
      pixies[i].draw();
    }
  }

  setInterval(draw, DRAW_INTERVAL);
});
