/*
  StudySprint Functionality
  Developed by:
  - Zamman Qureshi (Timer logic)

  Change Log:
  - v1.0: Basic countdown timer implemented
  - v1.1: Added reset functionality
  - v1.2: Added finish session logging, progress graph, and note saving
*/

let defaultTime = 1500;
let time = defaultTime;
let interval = null;

function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  document.getElementById("timer").innerText =
    `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      clearInterval(interval);
      interval = null;
      alert("Session complete. Click 'Finish Session' to save it.");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  time = defaultTime;
  updateDisplay();
}

function getSavedSessions() {
  return JSON.parse(localStorage.getItem("studySprintSessions")) || [];
}

function saveSessions(sessions) {
  localStorage.setItem("studySprintSessions", JSON.stringify(sessions));
}

function finishSession() {
  const major = document.getElementById("major").value.trim();
  const studyTopic = document.getElementById("studyTopic").value.trim();
  const extraNotes = document.getElementById("extraNotes").value.trim();

  const minutesCompleted = Math.floor((defaultTime - time) / 60);

  if (!major || !studyTopic) {
    alert("Please fill out both 'Major / Subject Area' and 'What did you study?' before finishing.");
    return;
  }

  if (minutesCompleted <= 0) {
    alert("You need to spend at least some time in the session before finishing it.");
    return;
  }

  const newSession = {
    major,
    studyTopic,
    extraNotes,
    minutes: minutesCompleted,
    date: new Date().toLocaleString()
  };

  const sessions = getSavedSessions();
  sessions.push(newSession);
  saveSessions(sessions);

  renderSessions();
  renderGraph();
  clearForm();
  resetTimer();

  alert("Session saved successfully.");
}

function clearForm() {
  document.getElementById("major").value = "";
  document.getElementById("studyTopic").value = "";
  document.getElementById("extraNotes").value = "";
}

function renderSessions() {
  const sessionList = document.getElementById("sessionList");
  const sessions = getSavedSessions();

  if (sessions.length === 0) {
    sessionList.innerHTML = `<div class="empty-state">No sessions saved yet.</div>`;
    return;
  }

  sessionList.innerHTML = sessions
    .slice()
    .reverse()
    .map(session => `
      <div class="session-item">
        <h3>${session.studyTopic}</h3>
        <p><strong>Major / Subject:</strong> ${session.major}</p>
        <p><strong>Minutes Studied:</strong> ${session.minutes}</p>
        <p><strong>Notes:</strong> ${session.extraNotes || "No extra notes added."}</p>
        <p><strong>Saved:</strong> ${session.date}</p>
      </div>
    `)
    .join("");
}

function renderGraph() {
  const graphContainer = document.getElementById("graphContainer");
  const sessions = getSavedSessions();

  if (sessions.length === 0) {
    graphContainer.innerHTML = `<div class="empty-state" style="width: 100%;">No progress yet. Finish a session to build your graph.</div>`;
    return;
  }

  const maxMinutes = Math.max(...sessions.map(session => session.minutes), 1);

  graphContainer.innerHTML = sessions
    .slice(-8)
    .map((session, index) => {
      const height = Math.max((session.minutes / maxMinutes) * 200, 24);
      return `
        <div class="bar-wrapper">
          <div class="bar" style="height: ${height}px;">${session.minutes}m</div>
          <div class="bar-label">S${index + 1}<br>${session.major}</div>
        </div>
      `;
    })
    .join("");
}

function clearSessions() {
  const confirmed = confirm("Are you sure you want to delete all saved sessions?");
  if (!confirmed) return;

  localStorage.removeItem("studySprintSessions");
  renderSessions();
  renderGraph();
}

updateDisplay();
renderSessions();
renderGraph();