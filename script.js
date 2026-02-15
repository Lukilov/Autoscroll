(function () {
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
