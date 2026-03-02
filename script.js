document.getElementById('webhookForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const webhook = document.getElementById('webhook').value.trim();

  if (!webhook || !isValidDiscordWebhook(webhook)) {
    alert("Webhook invalide !");
    return;
  }

  const btn = this.querySelector('button');
  btn.disabled = true;
  btn.textContent = "Encodage...";

  try {
    const res = await fetch("https://throbbing-dream-62ca.imran-ouarezki-f0c.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webhook })
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error);

    const area = document.getElementById('luaScript');
    area.value = data.script;  // format exact : getgenv() + loadstring
    area.style.display = "block";

    document.getElementById('resultTitle').textContent = "Script prêt à copier !";
    document.getElementById('resultTitle').style.display = "block";

    document.getElementById('copyBtn').style.display = "inline-block";

  } catch (err) {
    alert("Erreur : " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Gen Your Script";
  }
});
