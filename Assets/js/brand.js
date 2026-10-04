import { brandAssets } from './data/brandAssets';

const BASE_URL = 'https://assets.netdb.at/logo/';

const titles = {
  netdb: 'Netdb',
  'netdb-favicon': 'Netdb favicon',
  'url-shortener': 'URL Shortener',
  old: 'Legacy',
};

const firstGroups = ['netdb', 'netdb-favicon'];
const lastGroups = ['old'];

function groupOrder(a, b) {
  const rank = (g) => (firstGroups.includes(g) ? firstGroups.indexOf(g) - 100 : lastGroups.includes(g) ? 100 : 0);
  return rank(a) - rank(b) || a.localeCompare(b);
}

function groupTitle(group) {
  return titles[group] ?? group.charAt(0).toUpperCase() + group.slice(1);
}

function needsLightBackground(path) {
  const name = path.split('/').pop().toLowerCase();
  return name.includes('on-light') || name.includes('-black') || name === 'netdb_red.svg';
}

function isWide(path) {
  const name = path.split('/').pop().toLowerCase();
  return name.includes('horizontal') || name.includes('renders') || /1920x512|1080x512|logo_full|with_badge|netdb_red/.test(name);
}

function createTile(path) {
  const tile = document.createElement('a');
  tile.className = 'tile';
  if (isWide(path)) tile.classList.add('wide');
  tile.dataset.surface = needsLightBackground(path) ? 'light' : 'dark';
  tile.dataset.search = path.toLowerCase();
  tile.href = BASE_URL + path;
  tile.target = '_blank';
  tile.rel = 'noopener';

  const preview = document.createElement('div');
  preview.className = 'preview';
  const img = document.createElement('img');
  img.src = BASE_URL + path;
  img.alt = path;
  img.loading = 'lazy';
  preview.append(img);

  const label = document.createElement('div');
  label.className = 'label';
  const parts = path.split('/');
  const name = document.createElement('span');
  name.textContent = parts.pop();
  label.append(name);
  if (parts.length > 1) {
    const dir = document.createElement('small');
    dir.textContent = `${parts.slice(1).join('/')  }/`;
    label.prepend(dir);
  }

  const size = document.createElement('small');
  size.className = 'size';
  img.addEventListener('load', () => {
    if (!path.endsWith('.svg')) size.textContent = `${img.naturalWidth}×${img.naturalHeight}`;
  });
  img.addEventListener('error', () => tile.classList.add('missing'));
  label.append(size);

  tile.append(preview, label);
  return tile;
}

function render() {
  const groups = document.getElementById('groups');
  const jump = document.getElementById('jump');

  Object.keys(brandAssets)
    .sort(groupOrder)
    .forEach((group) => {
      const section = document.createElement('section');
      section.id = group;

      const heading = document.createElement('h2');
      heading.textContent = groupTitle(group);
      const count = document.createElement('span');
      count.className = 'count';
      count.textContent = brandAssets[group].length;
      heading.append(count);

      const grid = document.createElement('div');
      grid.className = 'grid';
      brandAssets[group].forEach((path) => grid.append(createTile(path)));

      section.append(heading, grid);
      groups.append(section);

      const link = document.createElement('a');
      link.href = `#${group}`;
      link.textContent = groupTitle(group);
      jump.append(link);
    });
}

function setupBackgroundToggle() {
  const buttons = document.querySelectorAll('[data-bg]');
  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.toggle('active', b === button));
      document.body.dataset.bg = button.dataset.bg;
    }),
  );
}

function setupFilter() {
  document.getElementById('filter').addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    document.querySelectorAll('section').forEach((section) => {
      let visible = 0;
      section.querySelectorAll('.tile').forEach((tile) => {
        const match = !query || tile.dataset.search.includes(query);
        tile.hidden = !match;
        if (match) visible++;
      });
      section.hidden = visible === 0;
    });
  });
}

document.body.dataset.bg = 'auto';
render();
setupBackgroundToggle();
setupFilter();
