// Elements
const regForm = document.getElementById("regForm");
const roleSection = document.getElementById("roleSection");
const roleText = document.getElementById("roleText");
const choiceSection = document.getElementById("choiceSection");
const friendChoice = document.getElementById("friendChoice");
const confirmChoice = document.getElementById("confirmChoice");

// Helper to generate random role
function getRandomRole(){
  const roles = ["Secret Friend","Normal User"];
  return roles[Math.floor(Math.random()*roles.length)];
}

// Registration
regForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  
  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value;
  const cls = document.getElementById("class").value;
  const section = document.getElementById("section").value;
  const gender = document.getElementById("gender").value;
  const roll = document.getElementById("roll").value;
  const personalities = [...document.querySelectorAll('input[name="personality"]:checked')].map(el=>el.value);

  // Check duplicate
  const snapshot = await db.collection("users").where("name","==",name).get();
  if(!snapshot.empty){
    alert("User with this name already exists!");
    return;
  }

  // Assign role
  const role = getRandomRole();

  // Store user in Firestore
  const userRef = await db.collection("users").add({
    name, dob, cls, section, gender, roll,
    personalities, role, matched:false, matchedWith:null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  const userId = userRef.id;
  localStorage.setItem("userId", userId);

  // Show role
  roleSection.style.display = "block";
  roleText.innerText = `Your role is: ${role}`;

  if(role === "Secret Friend"){
    choiceSection.style.display = "block";
    friendChoice.innerHTML = "";

    // Get potential Normal Users who are not matched
    const potential = await db.collection("users")
      .where("role","==","Normal User")
      .where("matched","==",false)
      .get();
    
    if(potential.empty){
      alert("No available Normal Users yet. Wait for others to register.");
      return;
    }

    potential.forEach(doc=>{
      const opt = document.createElement("option");
      opt.value = doc.id;
      opt.text = doc.data().name;
      friendChoice.appendChild(opt);
    });
  } else {
    // Normal User: wait to be picked by Secret Friend
    alert("You are a Normal User. Wait until a Secret Friend selects you.");
  }
});

// Confirm Secret Friend selection
confirmChoice.addEventListener("click", async ()=>{
  const friendId = friendChoice.value;
  if(!friendId) return alert("Select a friend!");

  const userId = localStorage.getItem("userId");
  if(!userId) return alert("User ID missing.");

  // Update matched status in users
  await db.collection("users").doc(userId).update({matched:true, matchedWith:friendId});
  await db.collection("users").doc(friendId).update({matched:true, matchedWith:userId});

  // Create match record
  const matchRef = await db.collection("matches").add({
    user1: userId,
    user2: friendId,
    role1: "Secret Friend",
    role2: "Normal User",
    approved1: true,
    approved2: true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  const matchId = matchRef.id;
  localStorage.setItem("matchId", matchId);

  alert("Secret Friend matched! Redirecting to chat...");
  window.location.href = "chat.html";
});

// Auto-redirect Normal Users when matched
async function checkForMatch(){
  const userId = localStorage.getItem("userId");
  if(!userId) return;

  const userDoc = await db.collection("users").doc(userId).get();
  if(!userDoc.exists) return;

  const data = userDoc.data();
  if(data.matched && data.matchedWith){
    // Find matchId
    const matchSnap = await db.collection("matches")
      .where("user1","==",userId)
      .get();
    
    if(matchSnap.empty){
      const matchSnap2 = await db.collection("matches")
        .where("user2","==",userId)
        .get();
      if(!matchSnap2.empty){
        const matchId = matchSnap2.docs[0].id;
        localStorage.setItem("matchId", matchId);
        window.location.href = "chat.html";
      }
    } else {
      const matchId = matchSnap.docs[0].id;
      localStorage.setItem("matchId", matchId);
      window.location.href = "chat.html";
    }
  }
}

// Check every 3 seconds for Normal Users
setInterval(checkForMatch, 3000);
