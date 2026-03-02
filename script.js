// script.js – Version finale (Mars 2026) – Encoding + pastefy auto via Worker

function isValidDiscordWebhook(url) {
  const prefix = "https://discord.com/api/webhooks/";
  if (!url.startsWith(prefix)) return false;
  const parts = url.slice(prefix.length).split('/');
  if (parts.length !== 2) return false;
  const id = parts[0];
  const token = parts[1];
  if (!/^\d{17,21}$/.test(id)) return false;
  if (!/^[a-zA-Z0-9_-]+$/.test(token)) return false;
  return true;
}

document.getElementById('webhookForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const webhookInput = document.getElementById('webhook');
  const webhook = webhookInput.value.trim();

  if (!webhook) {
    alert("Please enter a webhook!");
    return;
  }

  if (!isValidDiscordWebhook(webhook)) {
    alert("Error: Please enter a valid Discord webhook URL starting with https://discord.com/api/webhooks/");
    return;
  }

  // Désactive le bouton pendant le traitement
  const submitBtn = this.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";

  try {
    const response = await fetch("https://throbbing-dream-62ca.imran-ouarezki-f0c.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webhook })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Erreur serveur inconnue");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Affiche le script final (le plus court)
    const luaArea = document.getElementById('luaScript');
    luaArea.value = data.finalScript;
    luaArea.style.display = "block";

    document.getElementById('resultTitle').textContent = "Script obfuscé & hébergé automatiquement !";
    document.getElementById('resultTitle').style.display = "block";

    document.getElementById('copyBtn').style.display = "inline-block";

    // Message de succès
    alert("Succès ! Script prêt à copier.\nLien raw : " + data.rawUrl);

  } catch (err) {
    alert("Erreur : " + err.message + "\nVérifie ta connexion ou réessaie.");
    console.error("Erreur fetch Worker :", err);
  } finally {
    // Réactive le bouton
    submitBtn.disabled = false;
    submitBtn.textContent = "Gen Your Script";
  }
});

// Bouton copier
document.getElementById('copyBtn').addEventListener('click', function() {
  const luaArea = document.getElementById('luaScript');
  luaArea.select();
  luaArea.setSelectionRange(0, 99999);
  
  try {
    navigator.clipboard.writeText(luaArea.value);
    alert("Script copié dans le presse-papiers !");
  } catch (err) {
    alert("Erreur copie : " + err.message + "\nSélectionne et copie manuellement.");
  }
});
