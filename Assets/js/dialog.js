export function createDialog(title = 'Information', text = 'No information available', type = 'info') {
  const container = document.getElementById('dialog-container');

  if (container) {
    const dialog = document.createElement('div');
    dialog.classList.add('dialog');
    dialog.classList.add(type);

    const dialogTitle = document.createElement('h2');
    dialogTitle.classList.add('dialog-title');
    dialogTitle.textContent = title;

    const dialogText = document.createElement('p');
    dialogText.classList.add('dialog-content');
    dialogText.textContent = text;

    const dialogButton = document.createElement('button');
    dialogButton.classList.add('dialog-button');
    dialogButton.textContent = 'OK';

    dialog.appendChild(dialogTitle);
    dialog.appendChild(dialogText);
    dialog.appendChild(dialogButton);

    dialogButton.addEventListener('click', () => {
      if (container.children.length === 1) container.classList.remove('visible');

      dialog.remove();
    });

    container.appendChild(dialog);
    container.classList.add('visible');
  } else console.error('Dialog container not found');
}

export function initDialog(element = undefined) {
  element = element || window.document;

  Array.from(element.querySelectorAll('[target-dialog]')).forEach((button) => {
    const target = button.getAttribute('target');
    const dialog = document.getElementById(target);
    const submitButton = dialog.querySelector('[type="submit"]');

    dialog.hide = () => {
      dialog.classList.remove('visible');
      document.getElementById('dialog-container').classList.remove('visible');
      dialog.dispatchEvent(new CustomEvent('onHide', {
        detail: {
          reason: 'submit'
        }
      }));
    };

    dialog.show = () => {
      dialog.classList.add('visible');
      document.getElementById('dialog-container').classList.add('visible');
      dialog.dispatchEvent(new CustomEvent('onShow'));
    };

    if (dialog === undefined) {
      console.error('Dialog not found');
      return;
    }

    submitButton.addEventListener('click', () => {
      dialog.hide();
    });

    button.addEventListener('click', () => {
      dialog.classList.add('visible');
      document.getElementById('dialog-container').classList.add('visible');

      dialog.dispatchEvent(new CustomEvent('onShow'));

      setTimeout(() => {
        window.addEventListener(
          'click',
          function _listener(e) {
            if (e.target.closest(`#${  dialog.id}`) === null) {
              dialog.classList.remove('visible');
              dialog.dispatchEvent(new CustomEvent('onHide'));
              window.removeEventListener('click', _listener, true);
            }
          },
          true
        );
      }, 100);
    });
  });

  if (document.getElementById('dialog-container') !== null) return;

  const container = document.createElement('div');
  container.id = 'dialog-container';
  container.classList.add('dialog-container');

  //add event listener to window
  container.addEventListener('click', (event) => {
    if (event.target === container) {
      container.classList.remove('visible');

      Array.from(container.querySelectorAll('.dialog')).forEach((dialog) => {
        dialog.classList.remove('visible');
        dialog.dispatchEvent(new CustomEvent('onHide', { detail: { reason: 'canceled' } }));
      });

      Array.from(document.querySelectorAll('.custom-dialog.visible')).forEach((dialog) => {
        dialog.classList.remove('visible');
        dialog.dispatchEvent(new CustomEvent('onHide', { detail: { reason: 'canceled' } }));
      });
    }
  });

  document.body.appendChild(container);
}
