export function initSearchbar(data, id) {
  const searchbar = document.getElementById(id);
  const inputBox = searchbar.querySelector('input');

  try {
    if (inputBox.dataset.key && inputBox.dataset.key !== 'null') inputBox.value = data.find((e) => e.key === inputBox.dataset.key).name;
  } catch (e) {
    console.error(e);
  }

  inputBox.addEventListener('keyup', (e) => e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && filterSearch(inputBox.value, data, searchbar));
  inputBox.addEventListener('focus', () => searchbar.querySelector('.autocom-box').classList.add('active'));
  window.addEventListener('click', (e) => {
    if (!searchbar.contains(e.target)) searchbar.querySelector('.autocom-box').classList.remove('active');
    else filterSearch(inputBox.value, data, searchbar);
  });

  inputBox.onkeydown = (e) => {
    if (e.key === 'Enter') {
      const currentFocus = searchbar.querySelector('.autocom-box h1.focus');

      if (currentFocus) {
        inputBox.value = currentFocus.innerText;
        inputBox.dataset.key = currentFocus.dataset.key;
        searchbar.querySelector('.autocom-box').classList.remove('active');
      }

      return;
    }

    if (e.key === 'ArrowDown') {
      let currentFocus = searchbar.querySelector('.autocom-box h1.focus');

      if (currentFocus) currentFocus.classList.remove('focus');

      if (currentFocus && currentFocus.nextElementSibling) currentFocus = currentFocus.nextElementSibling;
      else currentFocus = searchbar.querySelector('.autocom-box h1');

      currentFocus.classList.add('focus');

      currentFocus.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (e.key === 'ArrowUp') {
      let currentFocus = searchbar.querySelector('.autocom-box h1.focus');

      if (currentFocus) currentFocus.classList.remove('focus');

      if (currentFocus && currentFocus.previousElementSibling) currentFocus = currentFocus.previousElementSibling;
      else currentFocus = searchbar.querySelector('.autocom-box h1:last-child');

      currentFocus.classList.add('focus');

      currentFocus.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (e.key === 'Escape') {
      searchbar.querySelector('.autocom-box').classList.remove('active');
      return;
    }

    if (!searchbar.querySelector('.autocom-box').classList.contains('active')) searchbar.querySelector('.autocom-box').classList.add('active');
  };
}

function filterSearch(userData, data, searchbar) {
  const suggestions = [];

  for (let i = 0; i < data.length; i++) suggestions.push(data[i]);

  const emptyArray = suggestions.filter((data) => data.name.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()));

  emptyArray.sort((a, b) => {
    if (a.name < b.name) return -1;

    if (a.name > b.name) return 1;

    return 0;
  });

  showSuggestions(emptyArray, searchbar);
}

function showSuggestions(list, searchbar) {
  list = list.map((data) => {
    return (data = `<h1 data-key="${  data.key  }">${  data.name  }</h1>`);
  });

  let listData = '';
  if (!list.length) {
    // const userValue = searchbar.querySelector('input').value;
    // listData = '<h1>' + userValue + '</h1>';
  } else {
    listData = list.join('');
  }

  searchbar.querySelector('.autocom-box').innerHTML = listData;

  const allList = searchbar.querySelector('.autocom-box').querySelectorAll('h1');
  for (let i = 0; i < allList.length; i++)
    allList[i].addEventListener('click', (e) => {
      searchbar.querySelector('input').value = e.target.innerText;
      searchbar.querySelector('input').dataset.key = e.target.dataset.key;
      searchbar.querySelector('.autocom-box').classList.remove('active');
    });

  searchbar.querySelector('.autocom-box h1')?.classList.add('focus');
}
