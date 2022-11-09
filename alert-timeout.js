const WARNING_IDLE_IN_SECONDS = 20 * 1000;
const EXPIRED_IDLE_IN_SECONDS = 30 * 1000;
let lastActivityTime = null;
let intervalId = null;

function listenTimeoutAtBackground() {
  intervalId = setInterval(() => {
    if (checkIsWarningActivity()) {
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
  return checkActivityDiffTime() >= WARNING_IDLE_IN_SECONDS;
}

function checkIsExpiredActivity() {
  return checkActivityDiffTime() >= EXPIRED_IDLE_IN_SECONDS;
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

wrapByPatch(refreshActivityTime, APPLICATION_REFRESH);

listenTimeoutAtBackground();

listenApplicationEvents();
