const fs = require('fs');
const path = require('path');

const LOCAL_IP = '192.168.100.5';
const LOCAL_PORT = '3000';
const BASE_URL = `http://${LOCAL_IP}:${LOCAL_PORT}`;

const minJsonPath = path.join(__dirname, '.dist', 'plugins.min.json');

// Read current JSON
const plugins = JSON.parse(fs.readFileSync(minJsonPath, 'utf8'));

// Rewrite url fields to point to local server
for (const plugin of plugins) {
  if (plugin.url) {
    // Extract just the path after /plugins/
    // e.g. "https://raw.githubusercontent.com/.../english/shanghaifantasy.js"
    //   -> "http://192.168.100.5:3000/plugins/english/shanghaifantasy.js"
    const match = plugin.url.match(/\/plugins\/(.+)$/);
    if (match) {
      plugin.url = `${BASE_URL}/plugins/${match[1]}`;
    }
  }
}

fs.writeFileSync(minJsonPath, JSON.stringify(plugins));
console.log('Done - URLs updated to', BASE_URL);

// Verify shanghaifantasy
const sf = plugins.find(p => p.id === 'shanghaifantasy');
if (sf) console.log('Shanghai Fantasy URL:', sf.url);
