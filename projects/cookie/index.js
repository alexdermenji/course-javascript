/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

// import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#app');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

function getCookies() {
  let cookies;
  if (document.cookie) {
    cookies = document.cookie.split('; ').reduce((prev, current) => {
      const [name, value] = current.split('=');
      prev[name] = value;
      return prev;
    }, {});
  }
  return cookies;
}

function printCookies(obj) {
  if (getCookies()) {
    listTable.innerHTML = '';
    for (const [key, value] of Object.entries(obj)) {
      createCell(key, value);
    }
  }
}

function removeCookie(value) {
  for (const child of listTable.childNodes) {
    if (child.tagName === 'TR') {
      if (child.firstElementChild.innerHTML === value) {
        child.remove();
      }
    }
  }
}

function createCell(name, value) {
  const newCell = document.createElement('tr');
  listTable.append(newCell);
  for (let i = 0; i < 3; i++) {
    const newTd = document.createElement('td');
    newCell.append(newTd);
    if (i === 0) {
      newTd.innerHTML = name;
    }
    if (i === 1) {
      newTd.innerHTML = value;
    }
    if (i === 2) {
      const newButton = document.createElement('button');
      newButton.innerHTML = 'Delete';
      newTd.append(newButton);
      newButton.classList.add('btn');
    }
  }
}

function sortCookies(key, value, symbol) {
  const keyValue = key + value;
  if (keyValue.includes(symbol)) {
    return true;
  } else return false;
}

filterNameInput.addEventListener('input', function (e) {
  const value = e.target.value;
  const obj = getCookies();
  const sortObj = {};
  for (const name in obj) {
    if (sortCookies(name, obj[name], value)) {
      sortObj[name] = obj[name];
    }
  }
  return printCookies(sortObj);
});

addButton.addEventListener('click', () => {
  if (document.cookie.indexOf(addNameInput.value) >= 0) {
    removeCookie(addNameInput.value);
  }
  document.cookie = `${addNameInput.value}=${addValueInput.value}`;

  if (sortCookies(addNameInput.value, addValueInput.value, filterNameInput.value)) {
    createCell(addNameInput.value, addValueInput.value);
  }
  addNameInput.value = '';
  addValueInput.value = '';
});

listTable.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn')) {
    e.target.parentElement.parentElement.remove();
    const currentCookieName =
      e.target.parentElement.parentElement.firstElementChild.innerHTML;
    const currentCookieValue =
      e.target.parentElement.parentElement.firstElementChild.nextElementSibling
        .textContent;

    document.cookie = `${currentCookieName}=${currentCookieValue}; max-age=0`;
  }
});

printCookies(getCookies());
