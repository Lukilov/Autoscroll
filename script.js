(function () {
  const SONG_ORDER = [
    "le-s-teboj.html",
    "tople-oci.html",
    "nisem-vazna.html",
    "dobra-mrha.html",
    "song.html",
    "rdeca-masna.html",
    "najlepse-pesmi.html",
    "komar.html",
    "ko-pa-prides-ti.html",
    "za-dobra-stara-vremena.html",
    "rad-bi-ti-rekel-nekaj-lepega.html",
    "povej-mi-marina.html",
    "solza-kane-mi.html",
    "mi-plesemo.html",
    "soba-102.html",
    "hej-duso-ko-nam-brani.html",
    "za-prijatelje.html",
    "dizem-sidro.html",
    "ko-se-zaljubis.html",
    "voljim-osmjeh-tvoj.html",
    "jagode-in-cokolada.html",
    "ako-su-to-samo-bile-lazi.html",
    "dez-naj-pada.html",
    "cela-ulica-nori.html",
    "lagala-nas-mala.html",
    "cao-lepa.html",
    "moja-mama-je-strela.html",
    "cas-bo-zacelil-svet.html",
    "stara-dobra.html"
  ];

  function initializeSongNavigation() {
    const navActions = document.querySelector(".nav-actions");
    if (!navActions) {
      return;
    }

    const navLinks = navActions.querySelectorAll("a.back");
    if (navLinks.length < 2) {
      return;
    }

    const currentSong = window.location.pathname.split("/").pop();
    const currentIndex = SONG_ORDER.indexOf(currentSong);
    if (currentIndex === -1) {
      return;
    }

    const previousIndex = (currentIndex - 1 + SONG_ORDER.length) % SONG_ORDER.length;
    const nextIndex = (currentIndex + 1) % SONG_ORDER.length;

    navLinks[0].setAttribute("href", SONG_ORDER[previousIndex]);
    navLinks[1].setAttribute("href", SONG_ORDER[nextIndex]);
  }

  initializeSongNavigation();

  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (!minutesInput || !secondsInput || !startBtn || !pauseBtn || !resetBtn) {
    return;
  }

  let animationId = null;
  let speedPxPerMs = 0;
  let lastFrameTime = 0;
  let hasSession = false;

  function getDurationMs() {
    const min = Math.max(0, Number(minutesInput.value) || 0);
    const sec = Math.max(0, Math.min(59, Number(secondsInput.value) || 0));
    minutesInput.value = String(min);
    secondsInput.value = String(sec);
    return (min * 60 + sec) * 1000;
  }

  function getMaxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function tick(now) {
    const dt = now - lastFrameTime;
    lastFrameTime = now;

    if (dt <= 0) {
      animationId = requestAnimationFrame(tick);
      return;
    }

    const maxScroll = getMaxScroll();
    const currentY = window.scrollY;

    if (currentY >= maxScroll) {
      stopAnimation();
      hasSession = false;
      speedPxPerMs = 0;
      return;
    }

    // Auto-scroll is based on current position, so manual scrolling
    // during playback shifts remaining time naturally.
    const nextPos = currentY + speedPxPerMs * dt;
    window.scrollTo({ top: nextPos, behavior: "auto" });

    if (nextPos < maxScroll) {
      animationId = requestAnimationFrame(tick);
    } else {
      stopAnimation();
      hasSession = false;
      speedPxPerMs = 0;
    }
  }

  startBtn.addEventListener("click", function () {
    if (animationId) {
      return;
    }

    if (!hasSession) {
      const durationMs = getDurationMs();
      if (durationMs <= 0) {
        return;
      }

      const maxScroll = getMaxScroll();
      const remainingDistance = Math.max(0, maxScroll - window.scrollY);
      if (remainingDistance <= 0) {
        return;
      }

      speedPxPerMs = remainingDistance / durationMs;
      hasSession = true;
    }

    lastFrameTime = performance.now();
    animationId = requestAnimationFrame(tick);
  });

  pauseBtn.addEventListener("click", function () {
    stopAnimation();
  });

  resetBtn.addEventListener("click", function () {
    stopAnimation();
    hasSession = false;
    speedPxPerMs = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("resize", function () {
    if (window.scrollY > getMaxScroll()) {
      window.scrollTo({ top: getMaxScroll(), behavior: "auto" });
    }
  });
})();
