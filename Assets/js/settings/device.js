import { deleteDevice } from '../data/auth/deleteDevice';
import { getDevices } from '../data/auth/getDevices';
import { logoutAllDevices } from '../data/auth/logoutAllDevices';
import { logoutDevice } from '../data/auth/logoutDevice';

LoginManager.isLoggedIn().then(async (e) => {
  let devices = [];

  if (!e && import.meta.env.MODE !== 'development') {
    const devicesReq = await getDevices();
    const devicesResponse = await devicesReq.json();

    if (devicesResponse.statusCode !== 200) {
      console.error(devicesResponse);
      return;
    }

    devices = devicesResponse.data;
  }

  createDevices(devices);

  document.getElementById('logoutAllDevices').onclick = async () => {
    await logoutAllDevices();

    window.location.href = LoginManager.buildLoginUrl(window.location.href);
  };
});

function createDevices(devices) {
  document.getElementById('devicesContainer').innerHTML = '';

  if (devices.length === 0) {
    const noDevices = document.createElement('p');
    noDevices.innerText = 'No devices found.';
    document.getElementById('devicesContainer').appendChild(noDevices);
    return;
  }

  devices.forEach((device) => {
    const row = document.createElement('div');
    row.id = `device_${device.id}`;
    const name = document.createElement('h1');
    name.innerText = `${device.os} ${device.browser}`;

    if (device.isCurrentDevice === true) name.innerText += ' (Current Device)';

    row.appendChild(name);
    const lastUsed = document.createElement('p');
    lastUsed.innerText = `Last used: ${new Date(device.lastLogin).toLocaleString()}`;
    row.appendChild(lastUsed);
    const logoutBtn = document.createElement('button');
    logoutBtn.innerText = 'Logout';
    logoutBtn.addEventListener('click', async () => {
      await logoutDevice(device.id);

      createDevices(devices.filter((d) => d.id !== device.id));

      if (device.isCurrentDevice)
        window.location.href = LoginManager.buildLoginUrl(window.location.href);
    });
    row.appendChild(logoutBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', async () => {
      await deleteDevice(device.id);

      createDevices(devices.filter((d) => d.id !== device.id));
    });
    row.appendChild(deleteBtn);
    document.getElementById('devicesContainer').appendChild(row);
  });
}
