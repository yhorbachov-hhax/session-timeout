let lastActivityTime = null;
let intervalId = null;

function listenTimeoutAtBackground() {
  intervalId = setInterval(() => {
    if (checkIsFocused() && checkIsWarningActivity()) {
      alert("Idle");

      if (checkIsExpiredActivity()) {
        wrapByPatch(expireActivityTime, APPLICATION_EXPIRE);
      } else {
        wrapByPatch(refreshActivityTime, APPLICATION_REFRESH);
      }
    }
  }, 1000);
}

function listenApplicationEvents() {
  listenEvent(APPLICATION_REFRESH, () => {
    console.log("Refresh from listener");

    refreshActivityTime();
  });

  listenEvent(APPLICATION_EXPIRE, () => {
    console.log("Expire from listener");

    expireActivityTime();
  });
}

function checkActivityDiffTime() {
  return getCurrentTime() - lastActivityTime;
}

function checkIsWarningActivity() {
  return checkActivityDiffTime() >= WARNING_IDLE_MILLISECONDS;
}

function checkIsExpiredActivity() {
  return checkActivityDiffTime() >= EXPIRED_IDLE_MILLISECONDS;
}

function expireActivityTime() {
  console.log("Expired");

  clearInterval(intervalId);

  lastActivityTime = null;
}

function refreshActivityTime() {
  console.log("Refreshed");

  lastActivityTime = getCurrentTime();
}

function computeActivityStatus() {
  return lastActivityTime ? "Active" : "Expired";
}

function checkIsFocused() {
  return document.hasFocus();
}

wrapByPatch(refreshActivityTime, APPLICATION_REFRESH);

listenTimeoutAtBackground();

listenApplicationEvents();
