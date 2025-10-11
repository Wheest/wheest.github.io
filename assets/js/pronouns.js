(function () {
  const pronouns = [
    { subject: "she", object: "her", possessive: "her" },
    { subject: "he", object: "him", possessive: "his" },
    { subject: "they", object: "them", possessive: "their" },
  ];

  // Randomly pick one pronoun set for this page load
  const choice = pronouns[Math.floor(Math.random() * pronouns.length)];

  // Update all spans with the appropriate form
  document.querySelectorAll(".pronoun").forEach((el) => {
    const type = el.dataset.type || "subject";
    el.textContent = choice[type] || choice.subject;
  });
})();
