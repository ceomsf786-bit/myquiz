// ✅ Firebase config from your project
const firebaseConfig = {
  apiKey: "AIzaSyCa2ntjqtWAfpIkNJht_Y-M2p_fijJKHLo",
  authDomain: "my-quiz-tracker.firebaseapp.com",
  projectId: "my-quiz-tracker",
  storageBucket: "my-quiz-tracker.firebasestorage.app",
  messagingSenderId: "962276187889",
  appId: "1:962276187889:web:8cd8be97d69e2240b39350"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const status = document.getElementById("status");
const leaderboard = document.getElementById("leaderboard");

// Submit quiz
async function submitQuiz() {
  const username = document.getElementById("username").value.trim();
  const answer = document.getElementById("answer").value.trim();

  if (!username) { alert("Enter your name!"); return; }

  let score = 0;
  if (answer === "7") score = 1;

  try {
    await db.collection("quizResults").add({
      username,
      score,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    status.innerText = "✅ Score saved!";
    document.getElementById("answer").value = "";
    loadLeaderboard();
  } catch (error) {
    console.error(error);
    status.innerText = "❌ Error saving score — check console.";
  }
}

// Load leaderboard (top 10)
async function loadLeaderboard() {
  leaderboard.innerHTML = "";
  const snapshot = await db.collection("quizResults")
    .orderBy("score", "desc")
    .orderBy("timestamp", "asc")
    .limit(10)
    .get();

  snapshot.forEach(doc => {
    const data = doc.data();
    const row = `<tr><td>${data.username}</td><td>${data.score}</td></tr>`;
    leaderboard.innerHTML += row;
  });
}

// Load leaderboard on page load
loadLeaderboard();
