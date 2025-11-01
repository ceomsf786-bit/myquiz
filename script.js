async function submitQuiz() {
  const username = document.getElementById("username").value.trim();
  const answer = document.getElementById("answer").value.trim();

  if (!username) return alert("Enter your name first!");

  let score = 0;
  if (answer === "7") score = 1;

  await db.collection("quizResults").add({
    username,
    score,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("✅ Quiz submitted!");
  document.getElementById("answer").value = "";
  loadLeaderboard();
}

async function loadLeaderboard() {
  const tbody = document.getElementById("leaderboard");
  tbody.innerHTML = "";

  const snapshot = await db.collection("quizResults")
    .orderBy("score", "desc")
    .orderBy("timestamp", "asc")
    .limit(10)
    .get();

  snapshot.forEach(doc => {
    const data = doc.data();
    const row = `<tr><td>${data.username}</td><td>${data.score}</td></tr>`;
    tbody.innerHTML += row;
  });
}

// Load leaderboard on page load
loadLeaderboard();

