import './style.css';
import { renderNetwork } from './network.js';

async function loadNetwork() {
  const response = await fetch('http://127.0.0.1:5000/api/network');

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const data = await response.json();

  document.querySelector('#status').textContent =
    `${data.nodes.length} papers and ${data.links.length} citation links`;

  renderNetwork(document.querySelector('#network'), data);
}

loadNetwork().catch(error => {
  document.querySelector('#status').textContent =
    `Could not load network: ${error.message}`;
});
