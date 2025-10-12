async function loadEvent() {
  const res = await fetch("data/settings.json");
  const data = await res.json();
  return data;
}

document.addEventListener("DOMContentLoaded", async () => {
  const eventData = await loadEvent();
  const unlockBtn = document.getElementById("unlock-btn");
  const passcodeInput = document.getElementById("passcode");
  const errorMsg = document.getElementById("error-message");
  const eventDetails = document.getElementById("event-details");

  unlockBtn.addEventListener("click", () => {
    if (passcodeInput.value === eventData.eventCode) {
      errorMsg.style.display = "none";
      eventDetails.style.display = "block";
      document.getElementById("event-name").innerText = eventData.eventName;
      document.getElementById("event-description").innerText = eventData.eventDescription;
    } else {
      errorMsg.style.display = "block";
      eventDetails.style.display = "none";
    }
  });

  // Accordion functionality
  document.querySelectorAll(".accordion-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      const panel = btn.nextElementSibling;
      panel.style.display = (panel.style.display === "block") ? "none" : "block";
    });
  });
});
