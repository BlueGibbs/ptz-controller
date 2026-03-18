// ================= CONFIG =================
const PAN_SPEED   = 10;
const TILT_SPEED  = 10;
const ZOOM_SPEED  = 5; // 1–7
const FOCUS_SPEED = 5; // 1–7

// ================= HELPERS =================
function fireAndForget(url) {
  fetch(url).catch(() => {
    const img = new Image();
    img.src = url;
  });
}

// ================= PTZ MOVEMENT =================
function movePTZ(ip, action, pan, tilt) {
  const url = `http://${ip}:8080/cgi-bin/ptzctrl.cgi?ptzcmd&${action}&${pan}&${tilt}`;
  fireAndForget(url);
}

function stopPTZ(ip) {
  // REQUIRED FORMAT
  const url = `http://${ip}:8080/cgi-bin/ptzctrl.cgi?ptzcmd&PTZSTOP&1&1`;
  fireAndForget(url);
}

// ================= ZOOM =================
function zoom(ip, action) {
  const url = `http://${ip}:8080/cgi-bin/ptzctrl.cgi?ptzcmd&${action}&${ZOOM_SPEED}`;
  fireAndForget(url);
}

function stopZoom(ip) {
  const url = `http://${ip}:8080/cgi-bin/ptzctrl.cgi?ptzcmd&ZOOMSTOP&${ZOOM_SPEED}`;
  fireAndForget(url);
}

// ================= FOCUS =================
function focus(ip, action) {
  const url = `http://${ip}:8080/cgi-bin/ptzctrl.cgi?ptzcmd&${action}&${FOCUS_SPEED}`;
  fireAndForget(url);
}

function stopFocus(ip) {
  const url = `http://${ip}:8080/cgi-bin/ptzctrl.cgi?ptzcmd&FOCUSSTOP&${FOCUS_SPEED}`;
  fireAndForget(url);
}

// ================= PRESETS =================
function recallPreset(ip, position) {
  const url = `http://${ip}:8080/cgi-bin/ptzctrl.cgi?ptzcmd&POSCALL&${position}`;
  fireAndForget(url);
}

// ================= UI BINDING =================

document.querySelectorAll(".camera").forEach(camera => {
  const ip = camera.dataset.ip;

  // Movement buttons
  camera.querySelectorAll("button[data-action]").forEach(button => {
    const action = button.dataset.action;

      button.addEventListener("mousedown", () => {
        switch (action) {
          case "UP":
            movePTZ(ip, "UP", 0, TILT_SPEED);
            break;
          case "DOWN":
            movePTZ(ip, "DOWN", 0, TILT_SPEED);
            break;
          case "LEFT":
            movePTZ(ip, "LEFT", PAN_SPEED, 0);
            break;
          case "RIGHT":
            movePTZ(ip, "RIGHT", PAN_SPEED, 0);
            break;
          case "ZOOMIN":
            zoom(ip, "ZOOMIN", ZOOM_SPEED);
            break;
          case "ZOOMOUT":
            zoom(ip, "ZOOMOUT", ZOOM_SPEED);
            break;
          case "FOCUSIN":
            focus(ip, "FOCUSIN", FOCUS_SPEED);
            break;
          case "FOCUSOUT":
            focus(ip, "FOCUSOUT", FOCUS_SPEED);
            break;
        }
      });

      button.addEventListener("mouseup", () => {
        if (action.startsWith("ZOOM")) stopZoom(ip);
        else if (action.startsWith("FOCUS")) stopFocus(ip);
        else stopPTZ(ip);
      });

      button.addEventListener("mouseleave", () => {
        if (action.startsWith("ZOOM")) stopZoom(ip);
        else if (action.startsWith("FOCUS")) stopFocus(ip);
        else stopPTZ(ip);
      });
    });


  // Preset buttons
  camera.querySelectorAll("button[data-preset]").forEach(button => {
    const position = button.dataset.preset;

    button.addEventListener("click", () => {
      recallPreset(ip, position);
    });
  });

});
