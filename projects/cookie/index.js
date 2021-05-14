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

//2. Если куки есть тогда очищаем талицу и создаем под каждый кук ячейку
function printCookies(obj) {
  if (getCookies()) {
    listTable.innerHTML = '';
    for (const [key, value] of Object.entries(obj)) {
      createCell(key, value);
    }
  }
}

//3. Находим все куки  и превращаем их в обьект
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

//4. Создаем ячейки в таблице
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

//7 Удаление куки из таблицы
function removeCookie(value) {
  for (const child of listTable.childNodes) {
    if (child.tagName === 'TR') {
      if (child.firstElementChild.innerHTML === value) {
        child.remove();
      }
    }
  }
}

//8 Проверяем если введенный текст в фильтр присутствует в таблице куков
function filterCookies(key, value, symbol) {
  const keyValue = key + value;
  if (keyValue.includes(symbol)) {
    return true;
  } else return false;
}

//9 при вводе фильтра выводим новую таблицу с совпадениями куков
filterNameInput.addEventListener('input', function (e) {
  const value = e.target.value; //значение из поля
  const obj = getCookies(); // куки из браузера
  const sortObj = {}; // сюда будем складывать новый отфильтрованный обьект
  for (const name in obj) {
    // проходимся по всем кукам
    if (filterCookies(name, obj[name], value)) {
      //если значение из поля есть в куках
      sortObj[name] = obj[name]; //создаем новые свойства в обьекте
    }
  }
  return printCookies(sortObj); // возращаем новый вывод таблицы
});

//6 Обрабочик на создание куки
addButton.addEventListener('click', () => {
  //если куки есть удаляем из таблицы
  if (document.cookie.indexOf(addNameInput.value) >= 0) {
    removeCookie(addNameInput.value);
  }

  //сохраняем в браузере
  document.cookie = `${addNameInput.value}=${addValueInput.value}`;

  // если кука соответствует фильтру то создаем под нее ячейку
  if (filterCookies(addNameInput.value, addValueInput.value, filterNameInput.value)) {
    createCell(addNameInput.value, addValueInput.value);
  }

  //очищаем поля
  addNameInput.value = '';
  addValueInput.value = '';
});

//5 Устанавливаем обработчик клика на кнопку delete
listTable.addEventListener('click', (e) => {
  //удаляем из таблицы
  if (e.target.classList.contains('btn')) {
    e.target.parentElement.parentElement.remove();

    //удаляем из браузера(????)
    const currentCookieName =
      e.target.parentElement.parentElement.firstElementChild.innerHTML;
    const currentCookieValue =
      e.target.parentElement.parentElement.firstElementChild.nextElementSibling
        .textContent;

    document.cookie = `${currentCookieName}=${currentCookieValue}; max-age=0`;
  }
});

//1. Выводим на экран все имеющиеся куки. В аргументе обьект
printCookies(getCookies());

/* 
Вопросы
1. в printCookies() Что лучше передать в аргумент, функцию или переменную?

2. в createCell() Есть ои более компактный способ создать ячейки в таблице. И Не хардкодить цифры в цикле

3. в listTable.addEventListener как можно избежать дублирования e.target.parentElement.parentElement.remove(); чтобы удалить всю строку

4. Есть ли способ по другому удалить куки из браузера

5.  в addButton.addEventListener можно ли не удалять куки из таблицы а просто изменять?

6. function removeCookie() Можно по другому удалять куки из таблицы?

7. function filterCookies() Можно по другому фильтровать?
*/
