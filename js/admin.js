document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signInBtn");
  const signOutBtn = document.getElementById("signOutBtn");
  const whoami = document.getElementById("whoami");

  if (signInBtn) {
    signInBtn.addEventListener("click", () => {
      const email = document.getElementById("adminEmail").value;
      const pass = document.getElementById("adminPass").value;

      firebase.auth().signInWithEmailAndPassword(email, pass)
        .then(userCred => {
          whoami.textContent = `✅ Logged in as ${userCred.user.email}`;
          signInBtn.style.display = "none";
          signOutBtn.style.display = "inline-block";
          document.getElementById("adminTabs").style.display = "flex";
          document.getElementById("adminActions").style.display = "block";
        })
        .catch(err => {
          alert("Login failed: " + err.message);
        });
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      firebase.auth().signOut().then(() => {
        whoami.textContent = "❌ Signed out";
        signInBtn.style.display = "inline-block";
        signOutBtn.style.display = "none";
        document.getElementById("adminTabs").style.display = "none";
        document.getElementById("adminActions").style.display = "none";
      });
    });
  }
});


