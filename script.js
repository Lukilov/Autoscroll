(function () {
  const PLAYLISTS = {
    maturanc: [
      { id: "le-s-teboj", file: "le-s-teboj.html" },
      { id: "tople-oci", file: "tople-oci.html" },
      { id: "nisem-vazna", file: "nisem-vazna.html" },
      { id: "dobra-mrha", file: "dobra-mrha.html" },
      { id: "song", file: "song.html" },
      { id: "rdeca-masna", file: "rdeca-masna.html" },
      { id: "najlepse-pesmi", file: "najlepse-pesmi.html" },
      { id: "komar", file: "komar.html" },
      { id: "ko-pa-prides-ti", file: "ko-pa-prides-ti.html" },
      { id: "za-dobra-stara-vremena", file: "za-dobra-stara-vremena.html" },
      { id: "rad-bi-ti-rekel-nekaj-lepega", file: "rad-bi-ti-rekel-nekaj-lepega.html" },
      { id: "povej-mi-marina", file: "povej-mi-marina.html" },
      { id: "solza-kane-mi", file: "solza-kane-mi.html" },
      { id: "mi-plesemo", file: "mi-plesemo.html" },
      { id: "soba-102", file: "soba-102.html" },
      { id: "hej-duso-ko-nam-brani", file: "hej-duso-ko-nam-brani.html" },
      { id: "za-prijatelje", file: "za-prijatelje.html" },
      { id: "dizem-sidro", file: "dizem-sidro.html" },
      { id: "ko-se-zaljubis", file: "ko-se-zaljubis.html" },
      { id: "voljim-osmjeh-tvoj", file: "voljim-osmjeh-tvoj.html" },
      { id: "jagode-in-cokolada", file: "jagode-in-cokolada.html" },
      { id: "ako-su-to-samo-bile-lazi", file: "ako-su-to-samo-bile-lazi.html" },
      { id: "dez-naj-pada", file: "dez-naj-pada.html" },
      { id: "cela-ulica-nori", file: "cela-ulica-nori.html" },
      { id: "lagala-nas-mala", file: "lagala-nas-mala.html" },
      { id: "cao-lepa", file: "cao-lepa.html" },
      { id: "moja-mama-je-strela", file: "moja-mama-je-strela.html" },
      { id: "cas-bo-zacelil-svet", file: "cas-bo-zacelil-svet.html" },
      { id: "stara-dobra", file: "stara-dobra.html" }
    ],
    pesmi2: [
      { id: "tople-oci", file: "tople-oci.html" },
      { id: "le-s-teboj", file: "le-s-teboj.html" },
      { id: "nisem-vazna", file: "nisem-vazna.html" },
      { id: "za-prijatelje", file: "za-prijatelje.html" },
      { id: "dobra-vila", file: "dobra-mrha.html" },
      { id: "song", file: "song.html" },
      { id: "mi-plesemo", file: "mi-plesemo.html" },
      { id: "ko-se-zaljubis", file: "ko-se-zaljubis.html" },
      { id: "rdeca-masna", file: "rdeca-masna.html" },
      { id: "najlepse-pesmi", file: "najlepse-pesmi.html" },
      { id: "voljim-osmjeh-tvoj", file: "voljim-osmjeh-tvoj.html" },
      { id: "komar", file: "komar.html" },
      { id: "ko-pa-prides-ti", file: "ko-pa-prides-ti.html" },
      { id: "jagode-in-cokolada", file: "jagode-in-cokolada.html" },
      { id: "povej-mi-marina", file: "povej-mi-marina.html" },
      { id: "stara-dobra", file: "stara-dobra.html" },
      { id: "ako-su-to-samo-bile-lazi", file: "ako-su-to-samo-bile-lazi.html" },
      { id: "za-dobra-stara-vremena", file: "za-dobra-stara-vremena.html" },
      { id: "rad-bi-ti-rekel-nekaj-lepega", file: "rad-bi-ti-rekel-nekaj-lepega.html" },
      { id: "soba-102", file: "soba-102.html" },
      { id: "cela-ulica-nori", file: "cela-ulica-nori.html" },
      { id: "lagala-nas-mala", file: "lagala-nas-mala.html" },
      { id: "cao-lepa", file: "cao-lepa.html" },
      { id: "moja-mama-je-strela", file: "moja-mama-je-strela.html" },
      { id: "cas-bo-zacelil-svet", file: "cas-bo-zacelil-svet.html" },
      { id: "dizem-sidro", file: "dizem-sidro.html" },
      { id: "dobra-mrha", file: "dobra-mrha.html" },
      { id: "solza-kane-mi", file: "solza-kane-mi.html" }
    ]
  };

  function resolvePlaylistKey() {
    const params = new URLSearchParams(window.location.search);
    return params.get("list") === "2" ? "pesmi2" : "maturanc";
  }

  function buildSongHref(song, playlistKey) {
    if (playlistKey === "pesmi2") {
      return `${song.file}?list=2&song=${encodeURIComponent(song.id)}`;
    }
    return song.file;
  }

  function resolveCurrentSongId(songOrder) {
    const params = new URLSearchParams(window.location.search);
    const songFromQuery = params.get("song");
    if (songFromQuery) {
      return songFromQuery;
    }

    const currentSongFile = window.location.pathname.split("/").pop();
    const song = songOrder.find(function (item) {
      return item.file === currentSongFile;
    });
    return song ? song.id : null;
  }

  function initializeSongNavigation() {
    const navActions = document.querySelector(".nav-actions");
    if (!navActions) {
      return;
    }

    const navLinks = navActions.querySelectorAll("a.back");
    if (navLinks.length < 2) {
      return;
    }

    const playlistKey = resolvePlaylistKey();
    const songOrder = PLAYLISTS[playlistKey];
    const currentSongId = resolveCurrentSongId(songOrder);
    const currentIndex = songOrder.findIndex(function (song) {
      return song.id === currentSongId;
    });
    if (currentIndex === -1) {
      return;
    }

    const previousIndex = (currentIndex - 1 + songOrder.length) % songOrder.length;
    const nextIndex = (currentIndex + 1) % songOrder.length;

    navLinks[0].setAttribute("href", buildSongHref(songOrder[previousIndex], playlistKey));
    navLinks[1].setAttribute("href", buildSongHref(songOrder[nextIndex], playlistKey));

    const exitLink = document.querySelector("a.back.exit");
    if (exitLink) {
      exitLink.setAttribute("href", playlistKey === "pesmi2" ? "pesmi-2.html" : "index.html");
    }
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
