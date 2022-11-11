function getTopWindow() {
  const targetWindow = window.opener ?? window;

  return targetWindow.top;
}

function getCurrentFocusedWindow() {
  return getTopWindow().focusedWindow;
}

function setCurrentFocusedWindow(targetWindow) {
  getTopWindow().focusedWindow = targetWindow;
}

function getCurrentTime() {
  return new Date().getTime();
}

function openFile(filePath) {
  window.open(filePath, "_blank", "popup,width=500,height=300");
}

function patchEvent(event) {
  getTopWindow().postMessage(event, "*");
}

function listenEvent(event, callback) {
  getTopWindow().addEventListener("message", (messageEvent) => {
    if (messageEvent.data.startsWith(event)) {
      callback(messageEvent.data);
    }
  });
}

function wrapByPatch(callback, event) {
  callback();

  patchEvent(event);
}

function connectEventToElement(eventType, element) {
  listenEvent(eventType, (eventData) => {
    const dataContent = eventData.replace(eventType, "");

    element.innerText = dataContent;
  });
}

function connectElementToEvent(element, eventType) {
  element.addEventListener("click", () => {
    const data = eventType + "Event from Connected element " + getCurrentTime();

    patchEvent(data);
  });
}

function connectActivityStatusToElement(element) {
  setInterval(() => {
    element.innerText = [computeActivityStatus(), getCurrentTime()].join(" ");
  }, 1000);
}
