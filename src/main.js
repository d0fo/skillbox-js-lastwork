import './assets/sass/main.scss';
import './assets/css/normalize.css';
import './assets/css/choices.min.css';
import './assets/img/Logo.svg';
import './assets/img/plus.png';
import './assets/img/mail.svg';
import './assets/img/arrow.svg';
import './assets/img/pagination-arrow-prev.svg';
import './assets/img/pagination-arrow-next.svg';
import './assets/img/minus-exchange-rate.svg';
import './assets/img/plus-exchange-rate.svg';
import './assets/img/preloader.svg';
import './assets/img/warning.svg';
import './assets/img/check.svg';
import './assets/img/success.svg';
import { el, mount } from 'redom';
import JustValidate from 'just-validate';

const yandeMapScriptHead = el('script', {
  src: 'https://api-maps.yandex.ru/2.1/?apikey=3a7c2666-e762-48b4-8e50-59b828bfc7ee&lang=ru_RU',
  type: 'text/javascript',
});
document.head.append(yandeMapScriptHead);

const container = el('div.container');
const header = el('div.header');
const logo = el('img.logo', { src: './img/Logo.svg', alt: 'Logo' });
const mainField = el('div.info-place');
const menuWrapper = el('div.menu-wrapper');
const preloaderWrapper = el('div.preloader');
mount(document.body, preloaderWrapper);

function authorizationModal(visible = 'invisible', errorText) {
  const authorization = el('form.authorization#authorization');
  const authorizationTitle = el('h2.authorization__title', 'Вход в аккаунт');
  const inputWrapperLogin = el('div.input-wrapper.input-wrapper-login');
  const inputWrapperPassword = el('div.input-wrapper.input-wrapper-psw');
  const labelLogin = el('label.label-login', 'Логин');
  const inputLogin = el('input#input-login', { placeholder: 'Placeholder' });
  const userError = el('div.user-error');
  const labelPassword = el('label.label-password', 'Пароль');
  const inputPassword = el('input#input-password', {
    placeholder: 'Placeholder',
    type: 'password',
  });
  const pswError = el('div.psw-error');
  const enterBtn = el('button.enter-btn.btn-reset', { type: 'submit' });
  const loginLink = el('a', 'Войти');

  mount(labelLogin, inputLogin);
  mount(labelLogin, userError);
  mount(labelPassword, inputPassword);
  mount(labelPassword, pswError);
  mount(inputWrapperLogin, labelLogin);
  mount(inputWrapperPassword, labelPassword);
  mount(authorization, authorizationTitle);
  mount(authorization, inputWrapperLogin);
  mount(authorization, inputWrapperPassword);
  mount(enterBtn, loginLink);
  mount(authorization, enterBtn);
  mount(mainField, authorization);

  //поле для ошибки
  const errorTransferWrapper = el(`div.error-transfer-wrapper.${visible}`);
  mount(authorization, errorTransferWrapper);
  const errorTooltip = el('div.error-tooltip', `${errorText}`);
  const errorTooltipTriangle = el('div.error-tooltip-triangle');
  mount(authorization, errorTooltip);
  mount(authorization, errorTooltipTriangle);

  errorTransferWrapper.addEventListener('mouseover', () => {
    errorTooltip.classList.add('visible');
    errorTooltipTriangle.classList.add('visible');
  });

  errorTransferWrapper.addEventListener('mouseleave', () => {
    errorTooltip.classList.remove('visible');
    errorTooltipTriangle.classList.remove('visible');
  });

  const validateAutorization = new JustValidate('#authorization');

  validateAutorization
    .addField('#input-login', [
      {
        rule: 'required',
        errorMessage: 'Поле обязательно для заполнения',
      },
      {
        rule: 'minLength',
        value: 6,
        errorMessage: 'Минимум 6 симолов',
      },
      {
        rule: 'customRegexp',
        value: /^\S*$/,
      },
    ])
    .addField('#input-password', [
      {
        rule: 'required',
        errorMessage: 'Поле обязательно для заполнения',
      },
      {
        rule: 'minLength',
        value: 6,
        errorMessage: 'Минимум 6 симолов',
      },
      {
        rule: 'customRegexp',
        value: /^\S*$/,
      },
    ]);
  inputLogin.addEventListener('input', () => {
    if (inputLogin.classList.contains('just-validate-success-field')) {
      userError.classList.remove('label-error-active');
      userError.classList.add('label-success-active');
    }
  });

  inputPassword.addEventListener('input', () => {
    if (inputPassword.classList.contains('just-validate-success-field')) {
      pswError.classList.remove('label-error-active');
      pswError.classList.add('label-success-active');
    }
  });

  authorization.addEventListener('submit', (event) => {
    event.preventDefault();
    if (inputLogin.classList.contains('just-validate-error-field')) {
      userError.classList.add('label-error-active');
    }
    if (inputPassword.classList.contains('just-validate-error-field')) {
      pswError.classList.add('label-error-active');
    }
    if (
      inputLogin.classList.contains('just-validate-success-field') &&
      inputPassword.classList.contains('just-validate-success-field')
    ) {
      getToken('http://localhost:3000/login', {
        login: `${inputLogin.value}`,
        password: `${inputPassword.value}`,
        // login: `developer`,
        // password: `skillbox`,
      }).then((data) => {
        // console.log(data.payload.token);
        if (data.payload != null) {
          getAccaunts(
            'http://localhost:3000/accounts',
            data.payload.token
          ).then((res) => {
            // console.log(data.payload.token);
            mainField.innerHTML = '';
            mainField.style.display = 'block';
            renderMenu(mainField, data.payload.token);
            mainField.classList.add('list-styles');
            renderAccounts(res, data.payload.token);
          });
        } else {
          mainField.innerHTML = '';
          authorizationModal('visible', data.error);
        }
      });
    }
  });
}

mount(header, logo);
mount(header, menuWrapper);
mount(container, header);
mount(container, mainField);
mount(window.document.body, container);

authorizationModal();

async function getToken(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function getAccaunts(url = '', token) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
  });
  return await response.json();
}

async function createAccount(url = '', token) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(),
  });
  return await response.json();
}

async function account_Details(url = '', token) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(),
  });
  return await response.json();
}

async function transferFounds(url = '', data = {}, token) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function getCurencies(url = '', token) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(),
  });
  return await response.json();
}

async function curencuBuy(url = '', data = {}, token) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function getAtmCoordinates(url = '', token) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(),
  });
  return await response.json();
}

function renderMenu(dir, token) {
  menuWrapper.innerHTML = '';

  const atm = el('button.menu-btn.atm-btn.btn-reset', 'Банкоматы');
  const accountsBtn = el('button.menu-btn.accounts-btn.btn-reset', 'Счета');
  const curency = el('button.menu-btn.curency-btn.btn-reset', 'Валюта');
  const logout = el('button.menu-btn.logout-btn.btn-reset', 'Выход');

  mount(menuWrapper, atm);
  mount(menuWrapper, accountsBtn);
  mount(menuWrapper, curency);
  mount(menuWrapper, logout);

  accountsBtn.classList.add('active-btn');
  const menuBtns = document.querySelectorAll('.menu-btn');

  curency.addEventListener('click', () => {
    dir.innerHTML = '';
    menuBtns.forEach((elem) => {
      elem.classList.remove('active-btn');
    });
    curency.classList.add('active-btn');
    getCurencies('http://localhost:3000/currencies', token).then((res) => {
      console.log(res);
      renderCurensies(res, token, dir);
    });
  });

  atm.addEventListener('click', () => {
    dir.innerHTML = '';
    dir.style.display = 'block';
    menuBtns.forEach((elem) => {
      elem.classList.remove('active-btn');
    });
    atm.classList.add('active-btn');
    const atmMapTitle = el('h2.atm-map-title', 'Карта банкоматов');
    mount(dir, atmMapTitle);
    const atmMap = el('div#map');
    mount(dir, atmMap);

    getAtmCoordinates('http://localhost:3000/banks', token).then((res) => {
      console.log(res);
      let atmObjects = [];
      res.payload.map((item, index) => {
        atmObjects.push({
          type: 'Feature',
          id: index + 1,
          geometry: {
            type: 'Point',
            coordinates: Object.values(item),
          },
        });
      });
      // eslint-disable-next-line no-undef
      ymaps.ready(init);
      function init() {
        // Создание карты.
        // eslint-disable-next-line no-undef
        var map = new ymaps.Map(
          'map',
          {
            center: [55.75979057261802, 37.613023784121985],
            zoom: 11,
          },
          {
            suppressMapOpenBlock: true,
          }
        );
        // eslint-disable-next-line no-undef
        var objectManager = new ymaps.ObjectManager({ clusterize: true });

        objectManager.add(atmObjects);
        map.geoObjects.add(objectManager);
      }
    });
  });
  accountsBtn.addEventListener('click', () => {
    dir.innerHTML = '';
    dir.style.display = 'block';
    menuBtns.forEach((elem) => {
      elem.classList.remove('active-btn');
    });
    accountsBtn.classList.add('active-btn');
    getAccaunts('http://localhost:3000/accounts', token).then((res) => {
      renderAccounts(res, token);
    });
  });
  logout.addEventListener('click', () => {
    menuWrapper.innerHTML = '';
    dir.innerHTML = '';
    dir.style.display = 'flex';
    dir.style.alignItems = 'center';
    authorizationModal();
  });
}
function renderCurensies(data, token, dir, visible = 'invisible', errorText) {
  dir.style.display = 'flex';
  dir.style.justifyContent = 'space-between';
  dir.style.alignItems = 'flex-start';
  const leftCurenciesWrapper = el('div.left-curencies-wrapper');
  const accountCurencies = el('div.account-curencies');
  const curensyExchangeForm = el('form.curency-exchange-form');
  const realTimeCurencyCourse = el('div.real-time-curency-change');

  mount(leftCurenciesWrapper, accountCurencies);
  mount(leftCurenciesWrapper, curensyExchangeForm);
  mount(dir, leftCurenciesWrapper);
  mount(dir, realTimeCurencyCourse);

  //список валют аккаунта
  const accountCurenciesTitle = el('h2.acount-curencies-title', 'Ваши валюты');
  mount(accountCurencies, accountCurenciesTitle);
  for (const key in data.payload) {
    const curencyItemWraper = el('div.curency-item-wrapper');
    mount(accountCurencies, curencyItemWraper);
    //проерка  положительного баланся счета
    let createElement = '';
    for (let i in data.payload[key]) {
      if (i == 'amount' && data.payload[key][i] > 0) {
        createElement = 'create';
      }
    }
    if (createElement == 'create') {
      for (const item in data.payload[key]) {
        if (item == 'code') {
          const curencyName = el('div.curency-name');
          curencyName.textContent = `${data.payload[key][item]}`;
          mount(curencyItemWraper, curencyName);
        }
        if (item == 'amount') {
          const curencyAmount = el('div.curency-amount');
          curencyAmount.textContent = `${data.payload[key][item]}`;
          mount(curencyItemWraper, curencyAmount);
        }
      }
    }
  }

  //курсы в реальном времени
  const realTimeCurencyCourseTitle = el(
    'h2.real-time-curencies-course-title',
    'Изменение курсов в реальном времени'
  );
  mount(realTimeCurencyCourse, realTimeCurencyCourseTitle);
  const realTimeCurencyCourseWrapper = el(
    'div.real-time-curency-course-wrapper'
  );
  mount(realTimeCurencyCourse, realTimeCurencyCourseWrapper);

  let socket = new WebSocket('ws://localhost:3000/currency-feed');
  socket.onmessage = function (event) {
    let courseChangeData = JSON.parse(event.data);
    const realTimeCurencyCourseItem = el('div.real-time-course-item');
    const curencyCourseName = el(
      'div.curency-course-name',
      `${courseChangeData.from}/${courseChangeData.to}`
    );
    const exchangeRate = el('div.excange-rate', `${courseChangeData.rate}`);
    mount(realTimeCurencyCourseItem, curencyCourseName);
    mount(realTimeCurencyCourseItem, exchangeRate);
    if (courseChangeData.change == 1) {
      realTimeCurencyCourseItem.classList.add('positive-course');
    }
    if (courseChangeData.change == -1) {
      realTimeCurencyCourseItem.classList.add('negative-course');
    }
    realTimeCurencyCourseWrapper.prepend(realTimeCurencyCourseItem);
    const excangeArr = document.querySelectorAll('.real-time-course-item');
    //ограничиваем колличество элементов в блоке
    if (excangeArr.length > 14) {
      realTimeCurencyCourseWrapper.innerHTML = '';
      for (let i of [...excangeArr].slice(0, 14)) {
        realTimeCurencyCourseWrapper.append(i);
      }
    }
  };

  //обмен валюты
  const excangeFormTitle = el('h2.exchange-form-title', 'Обмен валюты');
  mount(curensyExchangeForm, excangeFormTitle);
  const curencyExchengeWrapper = el('div.curency-exchange-wpapper');
  const exchangeFormLeftBlock = el('div.exchange-form-left-block');
  const excangeFormRightBlock = el('div.exchange-form-right-block');
  const excangeFormLeftTop = el('div.exchange-form-left-top');
  const excangeFormLeftBottom = el('div.exchange-form-left-bottom');
  mount(curensyExchangeForm, curencyExchengeWrapper);
  mount(curencyExchengeWrapper, exchangeFormLeftBlock);
  mount(curencyExchengeWrapper, excangeFormRightBlock);
  mount(exchangeFormLeftBlock, excangeFormLeftTop);
  mount(exchangeFormLeftBlock, excangeFormLeftBottom);
  const curencyToChangeLabel = el('label.curency-to-change-label', 'в');
  const curencyToChangeInput = el('input.curency-to-change-input', {
    readonly: 'readonly',
  });
  const curencyFromChangeLabel = el('label.curency-from-change-label', 'Из');
  const curencyFromChangeInput = el('input.curency-from-change-input', {
    readonly: 'readonly',
  });
  mount(curencyFromChangeLabel, curencyFromChangeInput);
  mount(curencyToChangeLabel, curencyToChangeInput);
  mount(excangeFormLeftTop, curencyFromChangeLabel);
  mount(excangeFormLeftTop, curencyToChangeLabel);
  const curensyExchangeSumLabel = el(
    'label.curency-exchange-sum-label',
    'Сумма'
  );
  const curensyExchangeSumInput = el('input.curency-exchange-sum-input');
  //стили на инпут, если отправлена слишком большая сумма
  if (errorText == 'Слишком мало средств' || errorText == 'Невалидное значение')
    curensyExchangeSumInput.classList.add('input-error-validation');
  mount(curensyExchangeSumLabel, curensyExchangeSumInput);
  mount(excangeFormLeftBottom, curensyExchangeSumLabel);
  const curencyChangeBtn = el(
    'button.curency-exchange-btn.btn-reset',
    'Обменять',
    {
      type: 'submit',
    }
  );
  mount(excangeFormRightBlock, curencyChangeBtn);

  //select ввалюты
  curencyFromChangeInput.value = 'BTC';
  const curencyFromWrapper = el('div.curency-from-wrapper');
  mount(curencyFromChangeLabel, curencyFromWrapper);

  curencyFromChangeInput.addEventListener('focus', () => {
    curencyFromWrapper.innerHTML = '';
    curencyFromWrapper.style.display = 'block';
    curencyFromChangeLabel.classList.add('curency-from-change-label--focus');
    for (const key in data.payload) {
      const curencyExchangeFromItemWraper = el(
        'div.curency-exchange-from-item-wrapper'
      );
      mount(curencyFromWrapper, curencyExchangeFromItemWraper);
      for (const item in data.payload[key]) {
        if (item == 'code') {
          const curencyFromName = el(
            'div.curency-from-name',
            `${data.payload[key][item]}`
          );
          mount(curencyExchangeFromItemWraper, curencyFromName);
          curencyFromName.addEventListener('mousedown', () => {
            curencyFromChangeInput.value = curencyFromName.textContent;
          });
        }
      }
    }
  });
  curencyFromChangeInput.addEventListener('blur', () => {
    curencyFromWrapper.style.display = 'none';
    curencyFromChangeLabel.classList.remove('curency-from-change-label--focus');
  });

  curencyToChangeInput.value = 'BTC';
  const curencyToWrapper = el('div.curency-to-wrapper');
  mount(curencyToChangeLabel, curencyToWrapper);

  curencyToChangeInput.addEventListener('focus', () => {
    curencyToWrapper.innerHTML = '';
    curencyToWrapper.style.display = 'block';
    curencyToChangeLabel.classList.add('curency-to-change-label--focus');
    for (const key in data.payload) {
      const curencyExchangeToItemWraper = el(
        'div.curency-exchange-from-item-wrapper'
      );
      mount(curencyToWrapper, curencyExchangeToItemWraper);
      for (const item in data.payload[key]) {
        if (item == 'code') {
          const curencyToName = el(
            'div.curency-to-name',
            `${data.payload[key][item]}`
          );
          mount(curencyExchangeToItemWraper, curencyToName);
          curencyToName.addEventListener('mousedown', () => {
            curencyToChangeInput.value = curencyToName.textContent;
          });
        }
      }
    }
  });
  curencyToChangeInput.addEventListener('blur', () => {
    curencyToWrapper.style.display = 'none';
    curencyToChangeLabel.classList.remove('curency-to-change-label--focus');
  });

  // фильтр вводимой суммы
  curensyExchangeSumInput.addEventListener('input', () => {
    curensyExchangeSumInput.value = curensyExchangeSumInput.value.replace(
      /\D/g,
      ''
    );
  });

  //создание элементов оповещения о ошибке

  renderErrorTooltip(curensyExchangeForm, visible, errorText);

  curencyChangeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (
      curensyExchangeSumInput.value !== '' &&
      curensyExchangeSumInput.value !== '0'
    ) {
      curencuBuy(
        'http://localhost:3000/currency-buy',
        {
          from: curencyFromChangeInput.value,
          to: curencyToChangeInput.value,
          amount: curensyExchangeSumInput.value,
        },
        token
      ).then((res) => {
        try {
          if (res.payload != null) {
            dir.innerHTML = '';
            renderCurensies(res, token, dir);
          }
          if (res.payload == null) {
            dir.innerHTML = '';
            if (res.error == 'Overdraft prevented') {
              errorText = 'Слишком мало средств';
              renderCurensies(data, token, dir, 'visible', errorText);
            }
          }
        } catch (error) {
          // dir.innerHTML = '';
          console.log(error);
        }
      });
    } else {
      dir.innerHTML = '';
      renderCurensies(data, token, dir, 'visible', 'Невалидное значение');
    }
  });
}

function monthBalanceCounter(data, monthNumber) {
  let newTransactionArr = data.payload.transactions.sort((a, b) => {
    if (a.date > b.date) return -1;
  });
  // console.log(newTransactionArr);
  let lastTransactionYear;
  let lastTransactionMonth;
  if (monthNumber == '6') {
    lastTransactionYear = new Date(newTransactionArr[0].date).getFullYear();
    lastTransactionMonth = new Date(newTransactionArr[0].date).getMonth();
  }

  if (monthNumber == '12') {
    const actualDate = new Date();
    lastTransactionYear = actualDate.getFullYear();
    lastTransactionMonth = actualDate.getMonth();
  }
  let firstMonthBalance = 0;
  let secondMonthBalance = 0;
  let thirdMonthBalance = 0;
  let fourthMonthBalance = 0;
  let fivthMonthBalance = 0;
  let sixMonthBalance = 0;
  let seventhMonthBalance = 0;
  let eightMonthBalance = 0;
  let ninethMonthBalance = 0;
  let tenthMonthBalance = 0;
  let eleventhMonthBalance = 0;
  let twelvethMonthBalance = 0;

  let firstMonthBalanceIncome = 0;
  let secondMonthBalanceIncome = 0;
  let thirdMonthBalanceIncome = 0;
  let fourthMonthBalanceIncome = 0;
  let fivthMonthBalanceIncome = 0;
  let sixMonthBalanceIncome = 0;
  let seventhMonthBalanceIncome = 0;
  let eightMonthBalanceIncome = 0;
  let ninethMonthBalanceIncome = 0;
  let tenthMonthBalanceIncome = 0;
  let eleventhMonthBalanceIncome = 0;
  let twelvethMonthBalanceIncome = 0;

  let firstMonthBalanceOutcome = 0;
  let secondMonthBalanceOutcome = 0;
  let thirdMonthBalanceOutcome = 0;
  let fourthMonthBalanceOutcome = 0;
  let fivthMonthBalanceOutcome = 0;
  let sixMonthBalanceOutcome = 0;
  let seventhMonthBalanceOutcome = 0;
  let eightMonthBalanceOutcome = 0;
  let ninethMonthBalanceOutcome = 0;
  let tenthMonthBalanceOutcome = 0;
  let eleventhMonthBalanceOutcome = 0;
  let twelvethMonthBalanceOutcome = 0;

  let firstMonthBalanceZIndex = 0;
  let secondMonthBalanceZIndex = 0;
  let thirdMonthBalanceZIndex = 0;
  let fourthMonthBalanceZIndex = 0;
  let fivthMonthBalanceZIndex = 0;
  let sixMonthBalanceZIndex = 0;
  let seventhMonthBalanceZIndex = 0;
  let eightMonthBalanceZIndex = 0;
  let ninethMonthBalanceZIndex = 0;
  let tenthMonthBalanceZIndex = 0;
  let eleventhMonthBalanceZIndex = 0;
  let twelvethMonthBalanceZIndex = 0;

  for (let elem of newTransactionArr) {
    //первый месяц
    if (
      lastTransactionMonth - new Date(elem.date).getMonth() === 0 &&
      elem.to === data.payload.account &&
      lastTransactionYear == new Date(elem.date).getFullYear()
    ) {
      firstMonthBalance = firstMonthBalance + elem.amount;
      firstMonthBalanceIncome = firstMonthBalanceIncome + elem.amount;
    }
    if (
      lastTransactionMonth - new Date(elem.date).getMonth() === 0 &&
      elem.from === data.payload.account &&
      lastTransactionYear == new Date(elem.date).getFullYear()
    ) {
      firstMonthBalance = firstMonthBalance - elem.amount;
      firstMonthBalanceOutcome = firstMonthBalanceOutcome + elem.amount;
    }
    //второй месяц
    if (lastTransactionMonth == 0) {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -11 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        secondMonthBalance = secondMonthBalance + elem.amount;
        secondMonthBalanceIncome = secondMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -11 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        secondMonthBalance = secondMonthBalance - elem.amount;
        secondMonthBalanceOutcome = secondMonthBalanceOutcome + elem.amount;
      }
    } else {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 1 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        secondMonthBalance = secondMonthBalance + elem.amount;
        secondMonthBalanceIncome = secondMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 1 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        secondMonthBalance = secondMonthBalance - elem.amount;
        secondMonthBalanceOutcome = secondMonthBalanceOutcome + elem.amount;
      }
    }
    //третий месяц
    if (lastTransactionMonth == 1) {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -10 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        thirdMonthBalance = thirdMonthBalance + elem.amount;
        thirdMonthBalanceIncome = thirdMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -10 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        thirdMonthBalance = thirdMonthBalance - elem.amount;
        thirdMonthBalanceOutcome = thirdMonthBalanceOutcome + elem.amount;
      }
    } else {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 2 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        thirdMonthBalance = thirdMonthBalance + elem.amount;
        thirdMonthBalanceIncome = thirdMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 2 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        thirdMonthBalance = thirdMonthBalance - elem.amount;
        thirdMonthBalanceOutcome = thirdMonthBalanceOutcome + elem.amount;
      }
    }
    //четвертый месяц
    if (lastTransactionMonth == 2) {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -9 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        fourthMonthBalance = fourthMonthBalance + elem.amount;
        fourthMonthBalanceIncome = fourthMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -9 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        fourthMonthBalance = fourthMonthBalance - elem.amount;
        fourthMonthBalanceOutcome = fourthMonthBalanceOutcome + elem.amount;
      }
    } else {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 3 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        fourthMonthBalance = fourthMonthBalance + elem.amount;
        fourthMonthBalanceIncome = fourthMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 3 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        fourthMonthBalance = fourthMonthBalance - elem.amount;
        fourthMonthBalanceOutcome = fourthMonthBalanceOutcome + elem.amount;
      }
    }
    //пятый месяц
    if (lastTransactionMonth == 3) {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -8 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        fivthMonthBalance = fivthMonthBalance + elem.amount;
        fivthMonthBalanceIncome = fivthMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -8 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        fivthMonthBalance = fivthMonthBalance - elem.amount;
        fivthMonthBalanceOutcome = fivthMonthBalanceOutcome + elem.amount;
      }
    } else {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 4 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        fivthMonthBalance = fivthMonthBalance + elem.amount;
        fivthMonthBalanceIncome = fivthMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 4 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        fivthMonthBalance = fivthMonthBalance - elem.amount;
        fivthMonthBalanceOutcome = fivthMonthBalanceOutcome + elem.amount;
      }
    }
    //шестой месяц
    if (lastTransactionMonth == 4) {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -7 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        sixMonthBalance = sixMonthBalance + elem.amount;
        sixMonthBalanceIncome = sixMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -7 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        sixMonthBalance = sixMonthBalance - elem.amount;
        sixMonthBalanceOutcome = sixMonthBalanceOutcome + elem.amount;
      }
    } else {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 5 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        sixMonthBalance = sixMonthBalance + elem.amount;
        sixMonthBalanceIncome = sixMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 5 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        sixMonthBalance = sixMonthBalance - elem.amount;
        sixMonthBalanceOutcome = sixMonthBalanceOutcome + elem.amount;
      }
    }
    //седьмой месяц
    if (lastTransactionMonth == 5) {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -6 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        seventhMonthBalance = seventhMonthBalance + elem.amount;
        seventhMonthBalanceIncome = seventhMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -6 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        seventhMonthBalance = seventhMonthBalance - elem.amount;
        seventhMonthBalanceOutcome = seventhMonthBalanceOutcome + elem.amount;
      }
    } else {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 6 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        seventhMonthBalance = seventhMonthBalance + elem.amount;
        seventhMonthBalanceIncome = seventhMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 6 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        seventhMonthBalance = seventhMonthBalance - elem.amount;
        seventhMonthBalanceOutcome = seventhMonthBalanceOutcome + elem.amount;
      }
    }
    //восьмой месяц
    if (lastTransactionMonth == 6) {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -5 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        eightMonthBalance = eightMonthBalance + elem.amount;
        eightMonthBalanceIncome = eightMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -5 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        eightMonthBalance = eightMonthBalance - elem.amount;
        eightMonthBalanceOutcome = eightMonthBalanceOutcome + elem.amount;
      }
    } else {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 7 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        eightMonthBalance = eightMonthBalance + elem.amount;
        eightMonthBalanceIncome = eightMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 7 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        eightMonthBalance = eightMonthBalance - elem.amount;
        eightMonthBalanceOutcome = eightMonthBalanceOutcome + elem.amount;
      }
    }
    //девятый месяц
    if (lastTransactionMonth == 7) {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -4 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        ninethMonthBalance = ninethMonthBalance + elem.amount;
        ninethMonthBalanceIncome = ninethMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -4 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        ninethMonthBalance = ninethMonthBalance - elem.amount;
        ninethMonthBalanceOutcome = ninethMonthBalanceOutcome + elem.amount;
      }
    } else {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 8 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        ninethMonthBalance = ninethMonthBalance + elem.amount;
        ninethMonthBalanceIncome = ninethMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 8 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        ninethMonthBalance = ninethMonthBalance - elem.amount;
        ninethMonthBalanceOutcome = ninethMonthBalanceOutcome + elem.amount;
      }
    }
    //десятый месяц
    if (lastTransactionMonth == 8) {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -3 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        tenthMonthBalance = tenthMonthBalance + elem.amount;
        tenthMonthBalanceIncome = tenthMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -3 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        tenthMonthBalance = tenthMonthBalance - elem.amount;
        tenthMonthBalanceOutcome = tenthMonthBalanceOutcome + elem.amount;
      }
    } else {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 9 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        tenthMonthBalance = tenthMonthBalance + elem.amount;
        tenthMonthBalanceIncome = tenthMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 9 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        tenthMonthBalance = tenthMonthBalance - elem.amount;
        tenthMonthBalanceOutcome = tenthMonthBalanceOutcome + elem.amount;
      }
    }
    //одиннадцатый месяц
    if (lastTransactionMonth == 9) {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -2 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        eleventhMonthBalance = eleventhMonthBalance + elem.amount;
        eleventhMonthBalanceIncome = eleventhMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -2 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        eleventhMonthBalance = eleventhMonthBalance - elem.amount;
        eleventhMonthBalanceOutcome = eleventhMonthBalanceOutcome + elem.amount;
      }
    } else {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 10 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        eleventhMonthBalance = eleventhMonthBalance + elem.amount;
        eleventhMonthBalanceIncome = eleventhMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 10 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        eleventhMonthBalance = eleventhMonthBalance - elem.amount;
        eleventhMonthBalanceOutcome = eleventhMonthBalanceOutcome + elem.amount;
      }
    }
    //двенядцатый месяц
    if (lastTransactionMonth == 10) {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -1 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        twelvethMonthBalance = twelvethMonthBalance + elem.amount;
        twelvethMonthBalanceIncome = twelvethMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == -1 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear() - 1
      ) {
        twelvethMonthBalance = twelvethMonthBalance - elem.amount;
        twelvethMonthBalanceOutcome = twelvethMonthBalanceOutcome + elem.amount;
      }
    } else {
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 11 &&
        elem.to === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        twelvethMonthBalance = twelvethMonthBalance + elem.amount;
        twelvethMonthBalanceIncome = twelvethMonthBalanceIncome + elem.amount;
      }
      if (
        lastTransactionMonth - new Date(elem.date).getMonth() == 11 &&
        elem.from === data.payload.account &&
        lastTransactionYear == new Date(elem.date).getFullYear()
      ) {
        twelvethMonthBalance = twelvethMonthBalance - elem.amount;
        twelvethMonthBalanceOutcome = twelvethMonthBalanceOutcome + elem.amount;
      }
    }
  }
  let monthsBalanceArr = [
    firstMonthBalance,
    secondMonthBalance,
    thirdMonthBalance,
    fourthMonthBalance,
    fivthMonthBalance,
    sixMonthBalance,
    seventhMonthBalance,
    eightMonthBalance,
    ninethMonthBalance,
    tenthMonthBalance,
    eleventhMonthBalance,
    twelvethMonthBalance,
  ];
  let monthsBalanceArrIncome = [
    firstMonthBalanceIncome,
    secondMonthBalanceIncome,
    thirdMonthBalanceIncome,
    fourthMonthBalanceIncome,
    fivthMonthBalanceIncome,
    sixMonthBalanceIncome,
    seventhMonthBalanceIncome,
    eightMonthBalanceIncome,
    ninethMonthBalanceIncome,
    tenthMonthBalanceIncome,
    eleventhMonthBalanceIncome,
    twelvethMonthBalanceIncome,
  ];
  let monthsBalanceArrOutcome = [
    firstMonthBalanceOutcome,
    secondMonthBalanceOutcome,
    thirdMonthBalanceOutcome,
    fourthMonthBalanceOutcome,
    fivthMonthBalanceOutcome,
    sixMonthBalanceOutcome,
    seventhMonthBalanceOutcome,
    eightMonthBalanceOutcome,
    ninethMonthBalanceOutcome,
    tenthMonthBalanceOutcome,
    eleventhMonthBalanceOutcome,
    twelvethMonthBalanceOutcome,
  ];
  let maxMonthBalance = Math.max.apply(null, monthsBalanceArr);
  let maxMonthBalanceInOutFirst = 0;
  let maxMonthBalanceInOutSecond = 0;
  let maxMonthBalanceIncome = Math.max.apply(null, monthsBalanceArrIncome);
  let maxMonthBalanceOutcome = Math.max.apply(null, monthsBalanceArrOutcome);
  if (maxMonthBalanceIncome > maxMonthBalanceOutcome) {
    maxMonthBalanceInOutFirst = maxMonthBalanceIncome;
    maxMonthBalanceInOutSecond = maxMonthBalanceOutcome;
  } else {
    maxMonthBalanceInOutFirst = maxMonthBalanceOutcome;
    maxMonthBalanceInOutSecond = maxMonthBalanceIncome;
  }
  if (firstMonthBalanceIncome > firstMonthBalanceOutcome)
    firstMonthBalanceZIndex = 1;
  if (secondMonthBalanceIncome > secondMonthBalanceOutcome)
    secondMonthBalanceZIndex = 1;
  if (thirdMonthBalanceIncome > thirdMonthBalanceOutcome)
    thirdMonthBalanceZIndex = 1;
  if (fourthMonthBalanceIncome > fourthMonthBalanceOutcome)
    fourthMonthBalanceZIndex = 1;
  if (fivthMonthBalanceIncome > fivthMonthBalanceOutcome)
    fivthMonthBalanceZIndex = 1;
  if (sixMonthBalanceIncome > sixMonthBalanceOutcome) sixMonthBalanceZIndex = 1;
  if (seventhMonthBalanceIncome > seventhMonthBalanceOutcome)
    seventhMonthBalanceZIndex = 1;
  if (eightMonthBalanceIncome > eightMonthBalanceOutcome)
    eightMonthBalanceZIndex = 1;
  if (ninethMonthBalanceIncome > ninethMonthBalanceOutcome)
    ninethMonthBalanceZIndex = 1;
  if (tenthMonthBalanceIncome > tenthMonthBalanceOutcome)
    tenthMonthBalanceZIndex = 1;
  if (eleventhMonthBalanceIncome > eleventhMonthBalanceOutcome)
    eleventhMonthBalanceZIndex = 1;
  if (twelvethMonthBalanceIncome > twelvethMonthBalanceOutcome)
    twelvethMonthBalanceZIndex = 1;
  return {
    lastTransactionMonth,
    maxMonthBalance,
    maxMonthBalanceInOutFirst,
    maxMonthBalanceInOutSecond,
    firstMonthBalance,
    secondMonthBalance,
    thirdMonthBalance,
    fourthMonthBalance,
    fivthMonthBalance,
    sixMonthBalance,
    seventhMonthBalance,
    eightMonthBalance,
    ninethMonthBalance,
    tenthMonthBalance,
    eleventhMonthBalance,
    twelvethMonthBalance,
    firstMonthBalanceIncome,
    secondMonthBalanceIncome,
    thirdMonthBalanceIncome,
    fourthMonthBalanceIncome,
    fivthMonthBalanceIncome,
    sixMonthBalanceIncome,
    seventhMonthBalanceIncome,
    eightMonthBalanceIncome,
    ninethMonthBalanceIncome,
    tenthMonthBalanceIncome,
    eleventhMonthBalanceIncome,
    twelvethMonthBalanceIncome,
    firstMonthBalanceOutcome,
    secondMonthBalanceOutcome,
    thirdMonthBalanceOutcome,
    fourthMonthBalanceOutcome,
    fivthMonthBalanceOutcome,
    sixMonthBalanceOutcome,
    seventhMonthBalanceOutcome,
    eightMonthBalanceOutcome,
    ninethMonthBalanceOutcome,
    tenthMonthBalanceOutcome,
    eleventhMonthBalanceOutcome,
    twelvethMonthBalanceOutcome,
    firstMonthBalanceZIndex,
    secondMonthBalanceZIndex,
    thirdMonthBalanceZIndex,
    fourthMonthBalanceZIndex,
    fivthMonthBalanceZIndex,
    sixMonthBalanceZIndex,
    seventhMonthBalanceZIndex,
    eightMonthBalanceZIndex,
    ninethMonthBalanceZIndex,
    tenthMonthBalanceZIndex,
    eleventhMonthBalanceZIndex,
    twelvethMonthBalanceZIndex,
  };
}

function monthsToFillDOMContent(data, monthNumber) {
  let firstMonthName;
  let secondMonthName;
  let thirdMonthName;
  let fourthMonthName;
  let fivthMonthName;
  let sixMonthName;
  let sevenMonthName;
  let eightMonthName;
  let nineMonthName;
  let tenthMonthName;
  let elevenMonthName;
  let twelveMonthName;
  let scaleMaxValue;
  if (data.payload.transactions.length != 0) {
    let maxBalanceValueOfMonths = Math.max.apply(
      null,
      Object.values(monthBalanceCounter(data, monthNumber))
    );
    // console.log('mbvom'+maxBalanceValueOfMonths);
    // scaleMaxValue = Math.pow(
    //   10,
    //   Math.ceil(Math.log10(maxBalanceValueOfMonths))
    // );
    scaleMaxValue = maxBalanceValueOfMonths.toFixed(0);
    //получаем последние 6 месяцев
    // console.log('smv'+scaleMaxValue)
    const monthArr = [
      'янв',
      'фев',
      'мар',
      'апр',
      'май',
      'июн',
      'июл',
      'авг',
      'сен',
      'окт',
      'ноя',
      'дек',
    ];
    if (monthBalanceCounter(data, monthNumber).lastTransactionMonth == 0) {
      firstMonthName = monthArr[0];
      secondMonthName = monthArr[11];
      thirdMonthName = monthArr[10];
      fourthMonthName = monthArr[9];
      fivthMonthName = monthArr[8];
      sixMonthName = monthArr[7];
      sevenMonthName = monthArr[6];
      eightMonthName = monthArr[5];
      nineMonthName = monthArr[4];
      tenthMonthName = monthArr[3];
      elevenMonthName = monthArr[2];
      twelveMonthName = monthArr[1];
    }
    if (monthBalanceCounter(data, monthNumber).lastTransactionMonth == 1) {
      firstMonthName = monthArr[1];
      secondMonthName = monthArr[0];
      thirdMonthName = monthArr[11];
      fourthMonthName = monthArr[0];
      fivthMonthName = monthArr[9];
      sixMonthName = monthArr[8];
      sevenMonthName = monthArr[7];
      eightMonthName = monthArr[6];
      nineMonthName = monthArr[5];
      tenthMonthName = monthArr[4];
      elevenMonthName = monthArr[3];
      twelveMonthName = monthArr[2];
    }
    if (monthBalanceCounter(data, monthNumber).lastTransactionMonth == 2) {
      firstMonthName = monthArr[2];
      secondMonthName = monthArr[1];
      thirdMonthName = monthArr[0];
      fourthMonthName = monthArr[11];
      fivthMonthName = monthArr[10];
      sixMonthName = monthArr[9];
      sevenMonthName = monthArr[8];
      eightMonthName = monthArr[7];
      nineMonthName = monthArr[6];
      tenthMonthName = monthArr[5];
      elevenMonthName = monthArr[4];
      twelveMonthName = monthArr[3];
    }
    if (monthBalanceCounter(data, monthNumber).lastTransactionMonth == 3) {
      firstMonthName = monthArr[3];
      secondMonthName = monthArr[2];
      thirdMonthName = monthArr[1];
      fourthMonthName = monthArr[0];
      fivthMonthName = monthArr[11];
      sixMonthName = monthArr[10];
      sevenMonthName = monthArr[9];
      eightMonthName = monthArr[8];
      nineMonthName = monthArr[7];
      tenthMonthName = monthArr[6];
      elevenMonthName = monthArr[5];
      twelveMonthName = monthArr[4];
    }
    if (monthBalanceCounter(data, monthNumber).lastTransactionMonth == 4) {
      firstMonthName = monthArr[4];
      secondMonthName = monthArr[3];
      thirdMonthName = monthArr[2];
      fourthMonthName = monthArr[1];
      fivthMonthName = monthArr[0];
      sixMonthName = monthArr[11];
      sevenMonthName = monthArr[10];
      eightMonthName = monthArr[9];
      nineMonthName = monthArr[8];
      tenthMonthName = monthArr[7];
      elevenMonthName = monthArr[6];
      twelveMonthName = monthArr[5];
    }
    if (
      // monthNumber =
      // '12' &&
      monthBalanceCounter(data, monthNumber).lastTransactionMonth == 5
    ) {
      firstMonthName = monthArr[5];
      secondMonthName = monthArr[4];
      thirdMonthName = monthArr[3];
      fourthMonthName = monthArr[2];
      fivthMonthName = monthArr[1];
      sixMonthName = monthArr[0];
      sevenMonthName = monthArr[11];
      eightMonthName = monthArr[10];
      nineMonthName = monthArr[9];
      tenthMonthName = monthArr[8];
      elevenMonthName = monthArr[7];
      twelveMonthName = monthArr[6];
    }
    // console.log('if')
    // console.log('MN')
    // console.log(monthNumber)
    // console.log('LTM')
    // console.log(monthBalanceCounter(data, monthNumber).lastTransactionMonth )
    if (
      // monthNumber =
      // '12' &&
      monthBalanceCounter(data, monthNumber).lastTransactionMonth == 6
    ) {
      firstMonthName = monthArr[6];
      secondMonthName = monthArr[5];
      thirdMonthName = monthArr[4];
      fourthMonthName = monthArr[3];
      fivthMonthName = monthArr[2];
      sixMonthName = monthArr[1];
      sevenMonthName = monthArr[0];
      eightMonthName = monthArr[11];
      nineMonthName = monthArr[10];
      tenthMonthName = monthArr[9];
      elevenMonthName = monthArr[8];
      twelveMonthName = monthArr[7];
    }
    if (
      // monthNumber =
      // '12' &&
      monthBalanceCounter(data, monthNumber).lastTransactionMonth == 7
    ) {
      firstMonthName = monthArr[7];
      secondMonthName = monthArr[6];
      thirdMonthName = monthArr[5];
      fourthMonthName = monthArr[4];
      fivthMonthName = monthArr[3];
      sixMonthName = monthArr[2];
      sevenMonthName = monthArr[1];
      eightMonthName = monthArr[0];
      nineMonthName = monthArr[11];
      tenthMonthName = monthArr[10];
      elevenMonthName = monthArr[9];
      twelveMonthName = monthArr[8];
    }
    if (
      // monthNumber =
      // '12' &&
      monthBalanceCounter(data, monthNumber).lastTransactionMonth == 8
    ) {
      firstMonthName = monthArr[8];
      secondMonthName = monthArr[7];
      thirdMonthName = monthArr[6];
      fourthMonthName = monthArr[5];
      fivthMonthName = monthArr[4];
      sixMonthName = monthArr[3];
      sevenMonthName = monthArr[2];
      eightMonthName = monthArr[1];
      nineMonthName = monthArr[0];
      tenthMonthName = monthArr[11];
      elevenMonthName = monthArr[10];
      twelveMonthName = monthArr[9];
    }
    if (
      // monthNumber =
      // '12' &&
      monthBalanceCounter(data, monthNumber).lastTransactionMonth == 9
    ) {
      firstMonthName = monthArr[9];
      secondMonthName = monthArr[8];
      thirdMonthName = monthArr[7];
      fourthMonthName = monthArr[6];
      fivthMonthName = monthArr[5];
      sixMonthName = monthArr[4];
      sevenMonthName = monthArr[3];
      eightMonthName = monthArr[2];
      nineMonthName = monthArr[1];
      tenthMonthName = monthArr[0];
      elevenMonthName = monthArr[11];
      twelveMonthName = monthArr[10];
    }
    if (
      // monthNumber =
      // '12' &&
      monthBalanceCounter(data, monthNumber).lastTransactionMonth == 10
    ) {
      firstMonthName = monthArr[10];
      secondMonthName = monthArr[9];
      thirdMonthName = monthArr[8];
      fourthMonthName = monthArr[7];
      fivthMonthName = monthArr[6];
      sixMonthName = monthArr[5];
      sevenMonthName = monthArr[4];
      eightMonthName = monthArr[3];
      nineMonthName = monthArr[2];
      tenthMonthName = monthArr[1];
      elevenMonthName = monthArr[0];
      twelveMonthName = monthArr[11];
    }

    if (
      // monthNumber =
      // '12' &&
      monthBalanceCounter(data, monthNumber).lastTransactionMonth == 11
    ) {
      firstMonthName = monthArr[11];
      secondMonthName = monthArr[10];
      thirdMonthName = monthArr[9];
      fourthMonthName = monthArr[8];
      fivthMonthName = monthArr[7];
      sixMonthName = monthArr[6];
      sevenMonthName = monthArr[5];
      eightMonthName = monthArr[4];
      nineMonthName = monthArr[3];
      tenthMonthName = monthArr[2];
      elevenMonthName = monthArr[1];
      twelveMonthName = monthArr[0];
    }

    // if (
    //   monthNumber == '6' &&
    //   monthBalanceCounter(data, monthNumber).lastTransactionMonth >= 5
    // ) {
    //   console.log('enter');
    //   firstMonthName =
    //     monthArr[monthBalanceCounter(data, monthNumber).lastTransactionMonth];
    //   secondMonthName =
    //     monthArr[
    //       monthBalanceCounter(data, monthNumber).lastTransactionMonth - 1
    //     ];
    //   thirdMonthName =
    //     monthArr[
    //       monthBalanceCounter(data, monthNumber).lastTransactionMonth - 2
    //     ];
    //   fourthMonthName =
    //     monthArr[
    //       monthBalanceCounter(data, monthNumber).lastTransactionMonth - 3
    //     ];
    //   fivthMonthName =
    //     monthArr[
    //       monthBalanceCounter(data, monthNumber).lastTransactionMonth - 4
    //     ];
    //   sixMonthName =
    //     monthArr[
    //       monthBalanceCounter(data, monthNumber).lastTransactionMonth - 5
    //     ];
    // }
  } else {
    firstMonthName = '';
    secondMonthName = '';
    thirdMonthName = '';
    fourthMonthName = '';
    fivthMonthName = '';
    sixMonthName = '';
    sevenMonthName = '';
    eightMonthName = '';
    nineMonthName = '';
    tenthMonthName = '';
    elevenMonthName = '';
    twelveMonthName = '';
    scaleMaxValue = '3000';
  }
  return {
    firstMonthName,
    secondMonthName,
    thirdMonthName,
    fourthMonthName,
    fivthMonthName,
    sixMonthName,
    sevenMonthName,
    eightMonthName,
    nineMonthName,
    tenthMonthName,
    elevenMonthName,
    twelveMonthName,
    scaleMaxValue,
  };
}

function balanseHistory(data, token) {
  const upperBlock = el('div.balance-history__upper-block');
  const secondBlock = el('div.balance-history__second-block');
  const thirdBlock = el('div.balance-history__dinamyc-balance');
  const fourthBlock = el('div.balance-history__relation-inoutcome');
  const fivthBlock = el('div.balance-history__history-transaction');

  //upper block
  const accountDetailsTitle = el('h2.account-details-title', 'История баланса');
  const backBtn = el('button.btn-reset.back-btn', 'Вернуться назад');
  mount(upperBlock, accountDetailsTitle);
  mount(upperBlock, backBtn);

  backBtn.addEventListener('click', () => {
    preloaderWrapper.classList.add('preloading');
    renderAccountDetails(data, token);
    account_Details(
      `http://localhost:3000/account/${data.payload.account}`,
      token
    ).then((res) => {
      mainField.innerHTML = '';
      preloaderWrapper.classList.remove('preloading');
      renderAccountDetails(res, token);
    });
  });

  //second block
  const accountDetailsNumber = el(
    'p.account-details-number',
    `№ ${data.payload.account}`
  );
  const balanceText = el('p.balance-text', 'Баланс');
  const balanceValue = el(
    'p.balance-value',
    `${new Intl.NumberFormat('ru').format(data.payload.balance)} \u20bd`
  );
  mount(secondBlock, accountDetailsNumber);
  mount(secondBlock, balanceText);
  mount(balanceText, balanceValue);

  //dynamic balance for year third block
  const dinamicBalanceYearTitle = el(
    'h2.dinamic-balance-year-title',
    'Динамика баланса'
  );
  const diagaramBalanceYearWrapper = el('div.diagram-balance-year-wrapper');
  const diagaramBalanceYearRight = el('div.diagram-balance-year-right');
  const diagram = el('div.diagram-balance-year');
  const monthsScale = el('div.months-scale-year');
  const balanceValueScale = el('div.balance-value-scale-year');
  mount(diagaramBalanceYearWrapper, diagaramBalanceYearRight);
  mount(diagaramBalanceYearRight, diagram);
  mount(diagaramBalanceYearRight, monthsScale);
  mount(diagaramBalanceYearWrapper, balanceValueScale);

  const firstMothYear = el('div.diagram-year-month.first-month-year');
  const secondMothYear = el('div.diagram-year-month.second-month-year');
  const thirdMothYear = el('div.diagram-year-month.third-month-year');
  const fourthMothYear = el('div.diagram-year-month.fourth-month-year');
  const fivthMothYear = el('div.diagram-year-month.fivth-month-year');
  const sixMothYear = el('div.diagram-year-month.six-month-year');
  const seventhMothYear = el('div.diagram-year-month.seventh-month-year');
  const eightMothYear = el('div.diagram-year-month.eight-month-year');
  const ninethMothYear = el('div.diagram-year-month.nineth-month-year');
  const tenthMothYear = el('div.diagram-year-month.tenth-month-year');
  const eleventhMothYear = el('div.diagram-year-month.eleventh-month-year');
  const twelvethMothYear = el('div.diagram-year-month.twelveth-month-year');
  mount(diagram, twelvethMothYear);
  mount(diagram, eleventhMothYear);
  mount(diagram, tenthMothYear);
  mount(diagram, ninethMothYear);
  mount(diagram, eightMothYear);
  mount(diagram, seventhMothYear);
  mount(diagram, sixMothYear);
  mount(diagram, fivthMothYear);
  mount(diagram, fourthMothYear);
  mount(diagram, thirdMothYear);
  mount(diagram, secondMothYear);
  mount(diagram, firstMothYear);
  //dinamic-balance block
  const firstMothYearName = el(
    'div.month-year-name.first-month-year-name',
    `${monthsToFillDOMContent(data, '12').firstMonthName}`
  );
  const secondMothYearName = el(
    'div.month-year-name.second-month-year-name',
    `${monthsToFillDOMContent(data, '12').secondMonthName}`
  );
  const thirdMothYearName = el(
    'div.month-year-name.third-month-year-name',
    `${monthsToFillDOMContent(data, '12').thirdMonthName}`
  );
  const fourthMothYearName = el(
    'div.month-year-name.fourth-month-year-name',
    `${monthsToFillDOMContent(data, '12').fourthMonthName}`
  );
  const fivthMothYearName = el(
    'div.month-year-name.fivth-month-year-name',
    `${monthsToFillDOMContent(data, '12').fivthMonthName}`
  );
  const sixMothYearName = el(
    'div.month-year-name.six-month-year-name',
    `${monthsToFillDOMContent(data, '12').sixMonthName}`
  );
  const seventhMothYearName = el(
    'div.month-year-name.seventh-month-year-name',
    `${monthsToFillDOMContent(data, '12').sevenMonthName}`
  );
  const eightMothYearName = el(
    'div.month-year-name.eight-month-year-name',
    `${monthsToFillDOMContent(data, '12').eightMonthName}`
  );
  const ninethMothYearName = el(
    'div.month-year-name.nineth-month-year-name',
    `${monthsToFillDOMContent(data, '12').nineMonthName}`
  );
  const tenthMothYearName = el(
    'div.month-year-name.tenth-month-year-name',
    `${monthsToFillDOMContent(data, '12').tenthMonthName}`
  );
  const eleventhMothYearName = el(
    'div.month-year-name.eleventh-month-year-name',
    `${monthsToFillDOMContent(data, '12').elevenMonthName}`
  );
  const twelvethMothYearName = el(
    'div.month-year-name.twelveth-month-year-name',
    `${monthsToFillDOMContent(data, '12').twelveMonthName}`
  );
  mount(monthsScale, twelvethMothYearName);
  mount(monthsScale, eleventhMothYearName);
  mount(monthsScale, tenthMothYearName);
  mount(monthsScale, ninethMothYearName);
  mount(monthsScale, eightMothYearName);
  mount(monthsScale, seventhMothYearName);
  mount(monthsScale, sixMothYearName);
  mount(monthsScale, fivthMothYearName);
  mount(monthsScale, fourthMothYearName);
  mount(monthsScale, thirdMothYearName);
  mount(monthsScale, secondMothYearName);
  mount(monthsScale, firstMothYearName);

  let scaleMaxValue = monthBalanceCounter(data, '12').maxMonthBalance.toFixed(
    0
  );
  const maxYScaleValue = el(
    'div.max-y-scale-value',
    `${new Intl.NumberFormat('ru').format(scaleMaxValue)} \u20bd`
  );
  const minYScaleValue = el('div.min-y-scale-value', '0 \u20bd');
  mount(balanceValueScale, maxYScaleValue);
  mount(balanceValueScale, minYScaleValue);

  mount(thirdBlock, dinamicBalanceYearTitle);
  mount(thirdBlock, diagaramBalanceYearWrapper);

  //fourth block creating
  const in_out_dinamicBalanceYearTitle = el(
    'h2.dinamic-balance-year-title',
    'Соотношение входящих исходящих транзакций'
  );
  const in_out_diagaramBalanceYearWrapper = el(
    'div.diagram-balance-year-wrapper'
  );
  const in_out_diagaramBalanceYearRight = el('div.diagram-balance-year-right');
  const in_out_diagram = el('div.diagram-balance-year');
  const in_out_monthsScale = el('div.months-scale-year');
  const in_out_balanceValueScale = el('div.balance-value-scale-year');
  mount(in_out_diagaramBalanceYearWrapper, in_out_diagaramBalanceYearRight);
  mount(in_out_diagaramBalanceYearRight, in_out_diagram);
  mount(in_out_diagaramBalanceYearRight, in_out_monthsScale);
  mount(in_out_diagaramBalanceYearWrapper, in_out_balanceValueScale);
  mount(fourthBlock, in_out_dinamicBalanceYearTitle);
  mount(fourthBlock, in_out_diagaramBalanceYearWrapper);

  const firstMothYearWrapper = el(
    'div.diagram-year-month-wrapper.first-month-year-wrapper'
  );
  const secondMothYearWrapper = el(
    'div.diagram-year-month-wrapper.second-month-year-wrapper'
  );
  const thirdMothYearWrapper = el(
    'div.diagram-year-month-wrapper.third-month-year-wrapper'
  );
  const fourthMothYearWrapper = el(
    'div.diagram-year-month-wrapper.fourth-month-year-wrapper'
  );
  const fivthMothYearWrapper = el(
    'div.diagram-year-month-wrapper.fivth-month-year-wrapper'
  );
  const sixMothYearWrapper = el(
    'div.diagram-year-month-wrapper.six-month-year-wrapper'
  );
  const seventhMothYearWrapper = el(
    'div.diagram-year-month-wrapper.seventh-month-year-wrapper'
  );
  const eightMothYearWrapper = el(
    'div.diagram-year-month-wrapper.eight-month-year-wrapper'
  );
  const ninethMothYearWrapper = el(
    'div.diagram-year-month-wrapper.nineth-month-year-wrapper'
  );
  const tenthMothYearWrapper = el(
    'div.diagram-year-month-wrapper.tenth-month-year-wrapper'
  );
  const eleventhMothYearWrapper = el(
    'div.diagram-year-month-wrapper.eleventh-month-year-wrapper'
  );
  const twelvethMothYearWrapper = el(
    'div.diagram-year-month-wrapper.twelveth-month-year-wrapper'
  );
  mount(in_out_diagram, twelvethMothYearWrapper);
  mount(in_out_diagram, eleventhMothYearWrapper);
  mount(in_out_diagram, tenthMothYearWrapper);
  mount(in_out_diagram, ninethMothYearWrapper);
  mount(in_out_diagram, eightMothYearWrapper);
  mount(in_out_diagram, seventhMothYearWrapper);
  mount(in_out_diagram, sixMothYearWrapper);
  mount(in_out_diagram, fivthMothYearWrapper);
  mount(in_out_diagram, fourthMothYearWrapper);
  mount(in_out_diagram, thirdMothYearWrapper);
  mount(in_out_diagram, secondMothYearWrapper);
  mount(in_out_diagram, firstMothYearWrapper);

  const firstMothYearIn = el('div.diagram-year-month-in.first-month-year-in');
  const secondMothYearIn = el('div.diagram-year-month-in.second-month-year-in');
  const thirdMothYearIn = el('div.diagram-year-month-in.third-month-year-in');
  const fourthMothYearIn = el('div.diagram-year-month-in.fourth-month-year-in');
  const fivthMothYearIn = el('div.diagram-year-month-in.fivth-month-year-in');
  const sixMothYearIn = el('div.diagram-year-month-in.six-month-year-in');
  const seventhMothYearIn = el(
    'div.diagram-year-month-in.seventh-month-year-in'
  );
  const eightMothYearIn = el('div.diagram-year-month-in.eight-month-year-in');
  const ninethMothYearIn = el('div.diagram-year-month-in.nineth-month-year-in');
  const tenthMothYearIn = el('div.diagram-year-month-in.tenth-month-year-in');
  const eleventhMothYearIn = el(
    'div.diagram-year-month-in.eleventh-month-year-in'
  );
  const twelvethMothYearIn = el(
    'div.diagram-year-month-in.twelveth-month-year-in'
  );

  const firstMothYearOut = el(
    'div.diagram-year-month-out.first-month-year-out'
  );
  const secondMothYearOut = el(
    'div.diagram-year-month-out.second-month-year-out'
  );
  const thirdMothYearOut = el(
    'div.diagram-year-month-out.third-month-year-out'
  );
  const fourthMothYearOut = el(
    'div.diagram-year-month-out.fourth-month-year-out'
  );
  const fivthMothYearOut = el(
    'div.diagram-year-month-out.fivth-month-year-out'
  );
  const sixMothYearOut = el('div.diagram-year-month-out.six-month-year-out');
  const seventhMothYearOut = el(
    'div.diagram-year-month-out.seventh-month-year-out'
  );
  const eightMothYearOut = el(
    'div.diagram-year-month-out.eight-month-year-out'
  );
  const ninethMothYearOut = el(
    'div.diagram-year-month-out.nineth-month-year-out'
  );
  const tenthMothYearOut = el(
    'div.diagram-year-month-out.tenth-month-year-out'
  );
  const eleventhMothYearOut = el(
    'div.diagram-year-month-out.eleventh-month-year-out'
  );
  const twelvethMothYearOut = el(
    'div.diagram-year-month-out.twelveth-month-year-out'
  );

  mount(firstMothYearWrapper, firstMothYearIn);
  mount(firstMothYearWrapper, firstMothYearOut);
  mount(secondMothYearWrapper, secondMothYearIn);
  mount(secondMothYearWrapper, secondMothYearOut);
  mount(thirdMothYearWrapper, thirdMothYearIn);
  mount(thirdMothYearWrapper, thirdMothYearOut);
  mount(fourthMothYearWrapper, fourthMothYearIn);
  mount(fourthMothYearWrapper, fourthMothYearOut);
  mount(fivthMothYearWrapper, fivthMothYearIn);
  mount(fivthMothYearWrapper, fivthMothYearOut);
  mount(sixMothYearWrapper, sixMothYearIn);
  mount(sixMothYearWrapper, sixMothYearOut);
  mount(seventhMothYearWrapper, seventhMothYearIn);
  mount(seventhMothYearWrapper, seventhMothYearOut);
  mount(eightMothYearWrapper, eightMothYearIn);
  mount(eightMothYearWrapper, eightMothYearOut);
  mount(ninethMothYearWrapper, ninethMothYearIn);
  mount(ninethMothYearWrapper, ninethMothYearOut);
  mount(tenthMothYearWrapper, tenthMothYearIn);
  mount(tenthMothYearWrapper, tenthMothYearOut);
  mount(eleventhMothYearWrapper, eleventhMothYearIn);
  mount(eleventhMothYearWrapper, eleventhMothYearOut);
  mount(twelvethMothYearWrapper, twelvethMothYearIn);
  mount(twelvethMothYearWrapper, twelvethMothYearOut);

  const in_out_firstMothYearName = el(
    'div.month-year-name.first-month-year-name',
    `${monthsToFillDOMContent(data, '12').firstMonthName}`
  );
  const in_out_secondMothYearName = el(
    'div.month-year-name.second-month-year-name',
    `${monthsToFillDOMContent(data, '12').secondMonthName}`
  );
  const in_out_thirdMothYearName = el(
    'div.month-year-name.third-month-year-name',
    `${monthsToFillDOMContent(data, '12').thirdMonthName}`
  );
  const in_out_fourthMothYearName = el(
    'div.month-year-name.fourth-month-year-name',
    `${monthsToFillDOMContent(data, '12').fourthMonthName}`
  );
  const in_out_fivthMothYearName = el(
    'div.month-year-name.fivth-month-year-name',
    `${monthsToFillDOMContent(data, '12').fivthMonthName}`
  );
  const in_out_sixMothYearName = el(
    'div.month-year-name.six-month-year-name',
    `${monthsToFillDOMContent(data, '12').sixMonthName}`
  );
  const in_out_seventhMothYearName = el(
    'div.month-year-name.seventh-month-year-name',
    `${monthsToFillDOMContent(data, '12').sevenMonthName}`
  );
  const in_out_eightMothYearName = el(
    'div.month-year-name.eight-month-year-name',
    `${monthsToFillDOMContent(data, '12').eightMonthName}`
  );
  const in_out_ninethMothYearName = el(
    'div.month-year-name.nineth-month-year-name',
    `${monthsToFillDOMContent(data, '12').nineMonthName}`
  );
  const in_out_tenthMothYearName = el(
    'div.month-year-name.tenth-month-year-name',
    `${monthsToFillDOMContent(data, '12').tenthMonthName}`
  );
  const in_out_eleventhMothYearName = el(
    'div.month-year-name.eleventh-month-year-name',
    `${monthsToFillDOMContent(data, '12').elevenMonthName}`
  );
  const in_out_twelvethMothYearName = el(
    'div.month-year-name.twelveth-month-year-name',
    `${monthsToFillDOMContent(data, '12').twelveMonthName}`
  );
  mount(in_out_monthsScale, in_out_twelvethMothYearName);
  mount(in_out_monthsScale, in_out_eleventhMothYearName);
  mount(in_out_monthsScale, in_out_tenthMothYearName);
  mount(in_out_monthsScale, in_out_ninethMothYearName);
  mount(in_out_monthsScale, in_out_eightMothYearName);
  mount(in_out_monthsScale, in_out_seventhMothYearName);
  mount(in_out_monthsScale, in_out_sixMothYearName);
  mount(in_out_monthsScale, in_out_fivthMothYearName);
  mount(in_out_monthsScale, in_out_fourthMothYearName);
  mount(in_out_monthsScale, in_out_thirdMothYearName);
  mount(in_out_monthsScale, in_out_secondMothYearName);
  mount(in_out_monthsScale, in_out_firstMothYearName);

  const in_out_maxValue = monthBalanceCounter(
    data,
    '12'
  ).maxMonthBalanceInOutFirst.toFixed(0);
  const in_out_middleValue = monthBalanceCounter(
    data,
    '12'
  ).maxMonthBalanceInOutSecond.toFixed(0);

  const in_out_maxScaleValue = el(
    'div.inout-max-scale-value',
    `${new Intl.NumberFormat('ru').format(in_out_maxValue)} \u20bd`
  );
  const in_out_middleScaleValue = el(
    'div.inout-middle-scale-value',
    `${new Intl.NumberFormat('ru').format(in_out_middleValue)} \u20bd`
  );
  const in_out_minScaleValue = el('div.inout-min-scale-value', '0 \u20bd');

  mount(in_out_balanceValueScale, in_out_maxScaleValue);
  mount(in_out_balanceValueScale, in_out_middleScaleValue);
  mount(in_out_balanceValueScale, in_out_minScaleValue);

  //history transactions
  const historyTransactionsWrapper = el('div.history-transactions-wrapper');
  mount(fivthBlock, historyTransactionsWrapper);

  renderHistoryTransactionTable(data, historyTransactionsWrapper, 0, 25);
  console.log('pagination');
  console.log(data);
  const paginationBtnsAmount = Math.ceil(data.payload.transactions.length / 25);
  console.log(paginationBtnsAmount);
  const paginationWrapper = el('div.pagination-wrapper');
  const paginationBlock = el('div.pagination-block');
  const previousBtn = el('div.previous-btn');
  const nextBtn = el('div.next-btn');
  const paginationBtnsWrapper = el('div.paginatio-btns-wrapper');

  for (let i = 0; i < paginationBtnsAmount; i++) {
    if (i < 5) {
      const paginationBtn = el('div.pagination-btn', `${i + 1}`);
      mount(paginationBtnsWrapper, paginationBtn);
    }
  }

  // const firstPagination = el('div.pagination-btn.first-pagination', `1`);
  // const secondPagination = el('div.pagination-btn.second-pagination', `2`);
  // const thirdPagination = el('div.pagination-btn.third-pagination', `3`);
  // const fourthPagination = el('div.pagination-btn.fourth-pagination', `4`);
  // const fivthPagination = el('div.pagination-btn.fivth-pagination', `5`);
  // const sixthPagination = el('div.pagination-btn.sixth-pagination', `6`);

  mount(paginationWrapper, paginationBlock);
  mount(paginationBlock, previousBtn);
  mount(paginationBlock, paginationBtnsWrapper);
  // mount(paginationBlock, firstPagination);
  // mount(paginationBlock, secondPagination);
  // mount(paginationBlock, thirdPagination);
  // mount(paginationBlock, fourthPagination);
  // mount(paginationBlock, fivthPagination);
  // mount(paginationBlock, sixthPagination);
  mount(paginationBlock, nextBtn);
  mount(fivthBlock, paginationWrapper);

  //
  mount(mainField, upperBlock);
  mount(mainField, secondBlock);
  mount(mainField, thirdBlock);
  mount(mainField, fourthBlock);
  mount(mainField, fivthBlock);

  // pagination
  const firstPagination = paginationBtnsWrapper.firstElementChild;
  firstPagination.classList.add('pagination-btn-active');
  const paginationBtns = document.querySelectorAll('.pagination-btn');
  paginationBtns.forEach((el) => {
    el.addEventListener('click', () => {
      historyTransactionsWrapper.innerHTML = '';
      // console.log(data);
      renderHistoryTransactionTable(
        data,
        historyTransactionsWrapper,
        (Number(el.textContent) - 1) * 25,
        (Number(el.textContent) - 1) * 25 + 25
      );
      paginationBtns.forEach((elem) => {
        elem.classList.remove('pagination-btn-active');
      });
      el.classList.add('pagination-btn-active');
    });
  });

  previousBtn.addEventListener('click', () => {
    if (firstPagination.textContent != 1) {
      paginationBtns.forEach((el) => {
        el.textContent = `${Number(el.textContent) - 1}`;
      });
    }
    historyTransactionsWrapper.innerHTML = '';
    paginationBtns.forEach((elem) => {
      elem.classList.remove('pagination-btn-active');
    });
    firstPagination.classList.add('pagination-btn-active');
    renderHistoryTransactionTable(
      data,
      historyTransactionsWrapper,
      Number(firstPagination.textContent),
      Number(firstPagination.textContent) + 25
    );
  });
  nextBtn.addEventListener('click', () => {
    // console.log(typeof paginationBtnsWrapper.lastElementChild.textContent);
    // console.log(typeof paginationBtnsAmount);
    if (
      paginationBtnsWrapper.lastElementChild.textContent < paginationBtnsAmount
    ) {
      paginationBtns.forEach((el) => {
        el.textContent = `${Number(el.textContent) + 1}`;
      });
      historyTransactionsWrapper.innerHTML = '';
      paginationBtns.forEach((elem) => {
        elem.classList.remove('pagination-btn-active');
      });
      firstPagination.classList.add('pagination-btn-active');
      renderHistoryTransactionTable(
        data,
        historyTransactionsWrapper,
        Number(firstPagination.textContent),
        Number(firstPagination.textContent) + 25
      );
    }
  });

  //third block
  if (data.payload.transactions.length != 0) {
    firstMothYear.style.height = `${
      (monthBalanceCounter(data, '12').firstMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;

    secondMothYear.style.height = `${
      (monthBalanceCounter(data, '12').secondMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;

    thirdMothYear.style.height = `${
      (monthBalanceCounter(data, '12').thirdMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;

    fourthMothYear.style.height = `${
      (monthBalanceCounter(data, '12').fourthMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;

    fivthMothYear.style.height = `${
      (monthBalanceCounter(data, '12').fivthMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;

    sixMothYear.style.height = `${
      (monthBalanceCounter(data, '12').sixMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;
    seventhMothYear.style.height = `${
      (monthBalanceCounter(data, '12').seventhMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;
    eightMothYear.style.height = `${
      (monthBalanceCounter(data, '12').eightMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;
    ninethMothYear.style.height = `${
      (monthBalanceCounter(data, '12').ninethMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;
    tenthMothYear.style.height = `${
      (monthBalanceCounter(data, '12').tenthMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;
    eleventhMothYear.style.height = `${
      (monthBalanceCounter(data, '12').eleventhMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;
    twelvethMothYear.style.height = `${
      (monthBalanceCounter(data, '12').twelvethMonthBalance / scaleMaxValue) *
      diagram.offsetHeight
    }px`;
  }
  //fourth block
  if (data.payload.transactions.length != 0) {
    firstMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').firstMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;

    secondMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').secondMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;

    thirdMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').thirdMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;

    fourthMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').fourthMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;

    fivthMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').fivthMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;

    sixMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').sixMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    seventhMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').seventhMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    eightMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').eightMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    ninethMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').ninethMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    tenthMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').tenthMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    eleventhMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').eleventhMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    twelvethMothYearIn.style.height = `${
      (monthBalanceCounter(data, '12').twelvethMonthBalanceIncome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;

    firstMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').firstMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;

    secondMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').secondMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;

    thirdMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').thirdMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;

    fourthMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').fourthMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;

    fivthMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').fivthMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;

    sixMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').sixMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    seventhMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').seventhMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    eightMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').eightMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    ninethMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').ninethMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    tenthMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').tenthMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    eleventhMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').eleventhMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    twelvethMothYearOut.style.height = `${
      (monthBalanceCounter(data, '12').twelvethMonthBalanceOutcome /
        in_out_maxValue) *
      in_out_diagram.offsetHeight
    }px`;
    if (monthBalanceCounter(data, '12').firstMonthBalanceZIndex === 1) {
      firstMothYearOut.style.zIndex = '10';
    } else {
      firstMothYearIn.style.zIndex = '10';
    }
    if (monthBalanceCounter(data, '12').secondMonthBalanceZIndex === 1) {
      secondMothYearOut.style.zIndex = '10';
    } else {
      secondMothYearIn.style.zIndex = '10';
    }
    if (monthBalanceCounter(data, '12').thirdMonthBalanceZIndex === 1) {
      thirdMothYearOut.style.zIndex = '10';
    } else {
      thirdMothYearIn.style.zIndex = '10';
    }
    if (monthBalanceCounter(data, '12').fourthMonthBalanceZIndex === 1) {
      fourthMothYearOut.style.zIndex = '10';
    } else {
      fourthMothYearIn.style.zIndex = '10';
    }
    if (monthBalanceCounter(data, '12').fivthMonthBalanceZIndex === 1) {
      fivthMothYearOut.style.zIndex = '10';
    } else {
      fivthMothYearIn.style.zIndex = '10';
    }
    if (monthBalanceCounter(data, '12').sixMonthBalanceZIndex === 1) {
      sixMothYearOut.style.zIndex = '10';
    } else {
      sixMothYearIn.style.zIndex = '10';
    }
    if (monthBalanceCounter(data, '12').seventhMonthBalanceZIndex === 1) {
      seventhMothYearOut.style.zIndex = '10';
    } else {
      seventhMothYearIn.style.zIndex = '10';
    }
    if (monthBalanceCounter(data, '12').eightMonthBalanceZIndex === 1) {
      eightMothYearOut.style.zIndex = '10';
    } else {
      eightMothYearIn.style.zIndex = '10';
    }
    if (monthBalanceCounter(data, '12').ninethMonthBalanceZIndex === 1) {
      ninethMothYearOut.style.zIndex = '10';
    } else {
      ninethMothYearIn.style.zIndex = '10';
    }
    if (monthBalanceCounter(data, '12').tenthMonthBalance === 1) {
      ninethMothYearOut.style.zIndex = '10';
    } else {
      ninethMothYearIn.style.zIndex = '10';
    }
    if (monthBalanceCounter(data, '12').eleventhMonthBalanceZIndex === 1) {
      eleventhMothYearOut.style.zIndex = '10';
    } else {
      eleventhMothYearIn.style.zIndex = '10';
    }
    if (monthBalanceCounter(data, '12').twelvethMonthBalanceZIndex === 1) {
      twelvethMothYearOut.style.zIndex = '10';
    } else {
      twelvethMothYearIn.style.zIndex = '10';
    }
  }
}

function renderHistoryTransactionTable(data, dir, start, end) {
  //transaction hictory create table
  const transactionHistoryTitle = el(
    'h2.transaction-history-title',
    'История переводов'
  );
  const transactionHistoryTable = el('div.transaction-history-table');
  const tableHeaderRow = el('div.header-row');
  const senderAccountColumn = el(
    'div.sender-account-column',
    'Счет отправителя'
  );
  const recipientAccountColumn = el(
    'div.recipient-account-column',
    'Счет получателя'
  );
  const summaColumn = el('div.summa-column', 'Сумма');
  const dateColumn = el('div.date-column', 'Дата');
  const transactionsDataRow = el('div.transactions-data');

  mount(transactionHistoryTable, tableHeaderRow);
  mount(tableHeaderRow, senderAccountColumn);
  mount(tableHeaderRow, recipientAccountColumn);
  mount(tableHeaderRow, summaColumn);
  mount(tableHeaderRow, dateColumn);

  // console.log('start' + start);
  // console.log('end' + end);
  // console.log(data.payload.transactions.slice(start, end));

  for (let elem of data.payload.transactions.slice(start, end)) {
    let summa;
    if (elem.to == data.payload.account) {
      summa = `+ ${new Intl.NumberFormat('ru').format(elem.amount)} \u20bd`;
    }
    if (elem.from == data.payload.account) {
      summa = `- ${new Intl.NumberFormat('ru').format(elem.amount)} \u20bd`;
    }

    //формат месяца
    const transactionDateData = new Date(elem.date);
    let transactionMonthData;
    if (transactionDateData.getMonth() <= 9) {
      transactionMonthData = `0${transactionDateData.getMonth() + 1}`;
    } else {
      transactionMonthData = transactionDateData.getMonth() + 1;
    }
    let transactionDateToTable;
    if (elem.data != '') {
      transactionDateToTable = `${transactionDateData.getDate()}.${transactionMonthData}.${transactionDateData.getFullYear()}`;
    } else {
      transactionDateToTable = '';
    }

    const transactionRow = el('div.transaction-row');
    const senderAccountDate = el('div.transaction-sender', `${elem.from}`);
    const recipientAccountDate = el('div.transaction-recipient', `${elem.to}`);
    const summaValue = el('div.transaction-amount', `${summa}`);
    const transactionDate = el(
      'div..transaction-date',
      `${transactionDateToTable}`
    );
    if (elem.to == data.payload.account) {
      summaValue.classList.add('amount-plus');
    }
    if (elem.from == data.payload.account) {
      summaValue.classList.add('amount-minus');
    }
    mount(transactionRow, senderAccountDate);
    mount(transactionRow, recipientAccountDate);
    mount(transactionRow, summaValue);
    mount(transactionRow, transactionDate);
    mount(transactionsDataRow, transactionRow);
  }
  mount(transactionHistoryTable, transactionsDataRow);
  mount(dir, transactionHistoryTitle);
  mount(dir, transactionHistoryTable);
}

function renderErrorTooltip(dir, visible, errorText) {
  const errorTransferWrapper = el(`div.error-transfer-wrapper.${visible}`);
  mount(dir, errorTransferWrapper);
  const errorTooltip = el('div.error-tooltip', `${errorText}`);
  const errorTooltipTriangle = el('div.error-tooltip-triangle');
  mount(dir, errorTooltip);
  mount(dir, errorTooltipTriangle);

  errorTransferWrapper.addEventListener('mouseover', () => {
    errorTooltip.classList.add('visible');
    errorTooltipTriangle.classList.add('visible');
  });

  errorTransferWrapper.addEventListener('mouseleave', () => {
    errorTooltip.classList.remove('visible');
    errorTooltipTriangle.classList.remove('visible');
  });
}

function renderAccountDetails(
  data,
  token,
  visible = 'invisible',
  errorText = '',
  lastRecipientNumber = '',
  lastTransactionAmount = ''
) {
  const upperBlock = el('div.upper-block');
  const secondBlock = el('div.second-block');
  const thirdBlock = el('div.third-block');
  const newTransaction = el('div.new-transaction');
  const balanceDynamic = el('div.balance-dynamic');
  const transactionHistory = el('div.transaction-history');

  const accountDetailsTitle = el('h2.account-details-title', 'Просмотр счета');
  const backBtn = el('button.btn-reset.back-btn', 'Вернуться назад');

  const accountDetailsNumber = el(
    'p.account-details-number',
    `№ ${data.payload.account}`
  );
  const balanceText = el('p.balance-text', 'Баланс');
  const balanceValue = el(
    'p.balance-value',
    `${new Intl.NumberFormat('ru').format(data.payload.balance)} \u20bd`
  );

  //new transaction create elements
  const newTransactionForm = el('form.new-transaction-form');
  const newTransactionTitle = el('h3.new-transaction-title', 'Новый перевод');
  const recipientNumberLabel = el(
    'label.recipient-label',
    'Номерсчета получателя'
  );
  const recipientNumberInput = el('input.recipient-input', {
    placeholder: 'Placeholder',
  });
  recipientNumberInput.value = lastRecipientNumber;
  // стили если нет такого счета
  if (errorText == 'Такого счета не существует')
    recipientNumberInput.classList.add('input-error-validation');
  const transactionCountLabel = el(
    'label.transaction-count-label',
    'Сумма перевода'
  );
  const transactionCountInput = el('input.transaction-count-input', {
    placeholder: 'Placeholder',
  });
  transactionCountInput.value = lastTransactionAmount;
  //стили если перерасход
  if (errorText == 'Слишком мало средств')
    transactionCountInput.classList.add('input-error-validation');
  const pushTransactionBtn = el(
    'button.btn-reset.push-transaction-btn',
    'Отправить'
  );

  //ошибка запроса новой транзакции
  const errorTransferWrapper = el(`div.error-transfer-wrapper.${visible}`);
  mount(newTransactionForm, errorTransferWrapper);
  const errorTooltip = el('div.error-tooltip', `${errorText}`);
  const errorTooltipTriangle = el('div.error-tooltip-triangle');
  mount(newTransactionForm, errorTooltip);
  mount(newTransactionForm, errorTooltipTriangle);

  errorTransferWrapper.addEventListener('mouseover', () => {
    errorTooltip.classList.add('visible');
    errorTooltipTriangle.classList.add('visible');
  });

  errorTransferWrapper.addEventListener('mouseleave', () => {
    errorTooltip.classList.remove('visible');
    errorTooltipTriangle.classList.remove('visible');
  });

  //автозаполнение инпута новой транзакции
  const autocomliteWrapper = el('div.autocomlite-wrapper');

  recipientNumberInput.addEventListener('focus', () => {
    autocomliteWrapper.innerHTML = '';
    recipientNumberLabel.classList.add('recipient-label-focus');
    let storage = JSON.parse(localStorage.getItem('recipientAccount'));
    let uniqStorageArr = [...new Set(storage)];
    if (storage) {
      autocomliteWrapper.style.display = 'block';
      for (let i of uniqStorageArr) {
        const autocomliteItem = el('div.autocomlite-item', `${i}`);
        mount(autocomliteWrapper, autocomliteItem);
        autocomliteItem.addEventListener('mousedown', () => {
          autocomliteWrapper.style.display = 'none';
          recipientNumberLabel.classList.remove('recipient-label-focus');
          recipientNumberInput.value = autocomliteItem.textContent;
        });
      }
    }
  });
  recipientNumberInput.addEventListener('blur', () => {
    autocomliteWrapper.style.display = 'none';
    recipientNumberLabel.classList.remove('recipient-label-focus');
  });

  pushTransactionBtn.addEventListener('click', (event) => {
    const saveRecipientNumber = recipientNumberInput.value;
    const saveAmountValue = transactionCountInput.value;
    event.preventDefault();
    preloaderWrapper.classList.add('preloading');
    if (
      transactionCountInput.value !== '' &&
      transactionCountInput.value !== '0'
    ) {
      transferFounds(
        'http://localhost:3000/transfer-funds',
        {
          from: data.payload.account,
          to: recipientNumberInput.value,
          amount: transactionCountInput.value,
        },
        token
      ).then((res) => {
        try {
          preloaderWrapper.classList.remove('preloading');
          let storage = JSON.parse(localStorage.getItem('recipientAccount'));
          if (recipientNumberInput.value != '') {
            if (!storage) {
              storage = [];
              const recipientAccountNumber = recipientNumberInput.value;
              storage.push(recipientAccountNumber);
              localStorage.setItem('recipientAccount', JSON.stringify(storage));
            } else {
              const recipientAccountNumber = recipientNumberInput.value;
              storage.push(recipientAccountNumber);
              localStorage.setItem('recipientAccount', JSON.stringify(storage));
            }
          }
          mainField.innerHTML = '';
          renderAccountDetails(res, token, 'invisible');
        } catch (error) {
          preloaderWrapper.classList.remove('preloading');
          mainField.innerHTML = '';

          if (res.error == 'Invalid account to') {
            renderAccountDetails(
              data,
              token,
              'visible',
              'Такого счета не существует',
              saveRecipientNumber,
              saveAmountValue
            );
          }
          if (res.error == 'Overdraft prevented') {
            renderAccountDetails(
              data,
              token,
              'visible',
              'Слишком мало средств',
              saveRecipientNumber,
              saveAmountValue
            );
          }
        }
      });
    } else {
      preloaderWrapper.classList.remove('preloading');
      // if(recipientNumberInput.value.length)
      renderErrorTooltip(newTransactionForm, 'visible', 'Заполните поля');
      recipientNumberInput.value = saveRecipientNumber;
      transactionCountInput.value = saveAmountValue;
      if (recipientNumberInput.value == '')
        recipientNumberInput.classList.add('input-error-validation');
      if (
        transactionCountInput.value == '' ||
        transactionCountInput.value == '0'
      )
        transactionCountInput.classList.add('input-error-validation');
      if (recipientNumberInput.value !== '')
        recipientNumberInput.classList.remove('input-error-validation');
      if (
        transactionCountInput.value !== '' &&
        transactionCountInput.value !== '0'
      )
        transactionCountInput.classList.remove('input-error-validation');
    }
  });
  // стили для тултипа ошибки
  if (visible == 'visible') {
    errorTransferWrapper.classList.remove('.invisible');
    errorTransferWrapper.classList.add(`${visible}`);
  }
  if (visible == 'invisible') {
    errorTransferWrapper.classList.remove('.visible');
    errorTransferWrapper.classList.add(`${visible}`);
  }

  //фильтр по вводу  для суммы
  recipientNumberInput.addEventListener('input', () => {
    recipientNumberInput.value = recipientNumberInput.value.replace(/\D/g, '');
  });
  transactionCountInput.addEventListener('input', () => {
    transactionCountInput.value = transactionCountInput.value.replace(
      /\D/g,
      ''
    );
  });

  //balnce dynamic create elements
  //получаем максимальный баланс за 6 месяцев

  const balanceDynamicTitle = el(
    'h3.balance-dynamic-title',
    'Динамика Баланса'
  );

  const barChartWrapper = el('div.bar-chart-wrapper');
  const balanceDiogaram = el('div.balance-diogram');
  const diogram = el('div.diogram');
  const monthScale = el('div.month-scale');
  // console.log(monthsToFillDOMContent(data, '6').sixMonthName);
  const sixMonthValue = el(
    'span.month-value.six-month-value',
    `${monthsToFillDOMContent(data, '6').sixMonthName}`
  );
  const fivthMonthValue = el(
    'span.month-value.fivth-month-value',
    `${monthsToFillDOMContent(data, '6').fivthMonthName}`
  );
  const fourthMonthValue = el(
    'span.month-value.fourth-month-value',
    `${monthsToFillDOMContent(data, '6').fourthMonthName}`
  );
  const thirdMonthValue = el(
    'span.month-value.third-month-value',
    `${monthsToFillDOMContent(data, '6').thirdMonthName}`
  );
  const secondMonthValue = el(
    'span.month-value.second-month-value',
    `${monthsToFillDOMContent(data, '6').secondMonthName}`
  );
  const firstMonthValue = el(
    'span.month-value.first-month-value',
    `${monthsToFillDOMContent(data, '6').firstMonthName}`
  );

  const sixMonthwrapper = el('div.month-wrapper');
  const fivthMonthwrapper = el('div.month-wrapper');
  const fourthMonthwrapper = el('div.month-wrapper');
  const thirdMonthwrapper = el('div.month-wrapper');
  const secondMonthwrapper = el('div.month-wrapper');
  const firstMonthwrapper = el('div.month-wrapper');

  const sixMonth = el('div.six-month');
  const fivthMonth = el('div.fivth-month');
  const fourthMonth = el('div.fourth-month');
  const thirdMonth = el('div.third-month');
  const secondMonth = el('div.second-month');
  const firstMonth = el('div.first-month');

  const scaleWrapper = el('div.scale-wrapper');
  const zeroBalanceValue = el('p.zero-value', '0 \u20bd');
  let scaleMaxValue = monthBalanceCounter(data, '12').maxMonthBalance.toFixed(
    0
  );
  const maxBalanceValue = el(
    'p.max-balance-value',
    `${new Intl.NumberFormat('ru').format(scaleMaxValue)} \u20bd`
  );

  balanceDynamic.addEventListener('click', () => {
    preloaderWrapper.classList.add('preloading');
    // balanseHistory(data, token);
    account_Details(
      `http://localhost:3000/account/${data.payload.account}`,
      token
    ).then((res) => {
      preloaderWrapper.classList.remove('preloading');
      mainField.innerHTML = '';
      balanseHistory(res, token);
    });
  });
  transactionHistory.addEventListener('click', () => {
    preloaderWrapper.classList.add('preloading');
    // balanseHistory(data, token);
    account_Details(
      `http://localhost:3000/account/${data.payload.account}`,
      token
    ).then((res) => {
      mainField.innerHTML = '';
      preloaderWrapper.classList.remove('preloading');
      balanseHistory(res, token);
    });
  });

  //transaction hictory create table
  renderHistoryTransactionTable(data, transactionHistory, 0, 10);

  // upperblock
  mount(upperBlock, accountDetailsTitle);
  mount(upperBlock, backBtn);

  //secondblock
  mount(secondBlock, accountDetailsNumber);
  mount(balanceText, balanceValue);
  mount(secondBlock, balanceText);

  //thirdblock
  mount(newTransactionForm, newTransactionTitle);
  mount(recipientNumberLabel, recipientNumberInput);
  mount(recipientNumberLabel, autocomliteWrapper);
  mount(newTransactionForm, recipientNumberLabel);
  mount(transactionCountLabel, transactionCountInput);
  mount(newTransactionForm, transactionCountLabel);
  mount(newTransactionForm, pushTransactionBtn);
  mount(newTransaction, newTransactionForm);
  mount(thirdBlock, newTransaction);

  mount(balanceDynamic, balanceDynamicTitle);
  mount(balanceDynamic, barChartWrapper);
  mount(barChartWrapper, balanceDiogaram);
  mount(barChartWrapper, scaleWrapper);
  mount(balanceDiogaram, diogram);
  mount(balanceDiogaram, monthScale);
  mount(monthScale, sixMonthValue);
  mount(monthScale, fivthMonthValue);
  mount(monthScale, fourthMonthValue);
  mount(monthScale, thirdMonthValue);
  mount(monthScale, secondMonthValue);
  mount(monthScale, firstMonthValue);
  mount(diogram, sixMonthwrapper);
  mount(sixMonthwrapper, sixMonth);
  mount(diogram, fivthMonthwrapper);
  mount(fivthMonthwrapper, fivthMonth);
  mount(diogram, fourthMonthwrapper);
  mount(fourthMonthwrapper, fourthMonth);
  mount(diogram, thirdMonthwrapper);
  mount(thirdMonthwrapper, thirdMonth);
  mount(diogram, secondMonthwrapper);
  mount(secondMonthwrapper, secondMonth);
  mount(diogram, firstMonthwrapper);
  mount(firstMonthwrapper, firstMonth);
  mount(scaleWrapper, maxBalanceValue);
  mount(scaleWrapper, zeroBalanceValue);
  mount(thirdBlock, balanceDynamic);

  //mainfield
  mount(mainField, upperBlock);
  mount(mainField, secondBlock);
  mount(mainField, thirdBlock);
  mount(mainField, transactionHistory);

  if (data.payload.transactions.length != 0) {
    firstMonth.style.height = `${
      (monthBalanceCounter(data, '6').firstMonthBalance / scaleMaxValue) *
      firstMonthwrapper.offsetHeight
    }px`;

    firstMonth.style.height = `${
      (monthBalanceCounter(data, '6').firstMonthBalance / scaleMaxValue) *
      firstMonthwrapper.offsetHeight
    }px`;

    secondMonth.style.height = `${
      (monthBalanceCounter(data, '6').secondMonthBalance / scaleMaxValue) *
      firstMonthwrapper.offsetHeight
    }px`;

    thirdMonth.style.height = `${
      (monthBalanceCounter(data, '6').thirdMonthBalance / scaleMaxValue) *
      firstMonthwrapper.offsetHeight
    }px`;

    fourthMonth.style.height = `${
      (monthBalanceCounter(data, '6').fourthMonthBalance / scaleMaxValue) *
      firstMonthwrapper.offsetHeight
    }px`;

    fivthMonth.style.height = `${
      (monthBalanceCounter(data, '6').fivthMonthBalance /
        monthsToFillDOMContent(data, '6').scaleMaxValue) *
      firstMonthwrapper.offsetHeight
    }px`;

    sixMonth.style.height = `${
      (monthBalanceCounter(data, '6').sixMonthBalance /
        monthsToFillDOMContent(data, '6').scaleMaxValue) *
      firstMonthwrapper.offsetHeight
    }px`;
  }

  backBtn.addEventListener('click', () => {
    getAccaunts('http://localhost:3000/accounts', token).then((res) => {
      mainField.innerHTML = '';
      renderAccounts(res, token);
    });
  });
}

function renderAccounts(data, token, sorting = '') {
  const optionWrapper = el('div.option-wrapper');
  const listWrapper = el('div.list-wrapper');
  const sortWrapper = el('div.sort-wrapper');
  const accountTitle = el('h2.accounts-title', 'Ваши счета');
  const addNewAccountBtn = el(
    'button.btn-reset.new-account-btn',
    'Создать новый счет'
  );

  const accountsList = el('ul.accounts-list.list-reset');
  // console.log(data);
  for (var elem of data.payload) {
    // console.log(elem);
    const listItem = el('li.list-item');
    const buttonWrapper = el('div.button-wrapper');
    const accountDetails = el('button.account-detail-btn.btn-reset', 'Открыть');
    const accountNumber = el('p.account-number', `${elem.account}`);
    const accountBalance = el('p.account-balance', `${elem.balance}  \u20bd`);
    let accountDateLastTransaction;
    if (elem.transactions.length > 0) {
      const lastTransactionDate = new Date(
        elem.transactions[elem.transactions.length - 1].date
      );
      accountDateLastTransaction = el(
        'p.date-last-transaction',
        `${lastTransactionDate.getDate()} ${lastTransactionDate.toLocaleString(
          'default',
          { month: 'long' }
        )} ${lastTransactionDate.getFullYear()}`
      );
    } else {
      accountDateLastTransaction = el(
        'p.date-last-transaction',
        'Нет транзакций'
      );
    }
    const dateTransactionText = el(
      'p.date-transaction-bold',
      'Последняя транзакция'
    );
    mount(dateTransactionText, accountDateLastTransaction);
    mount(buttonWrapper, dateTransactionText);
    mount(buttonWrapper, accountDetails);
    mount(listItem, accountNumber);
    mount(listItem, accountBalance);
    mount(listItem, buttonWrapper);
    mount(accountsList, listItem);

    accountDetails.addEventListener('click', () => {
      // console.log(accountNumber.textContent);
      preloaderWrapper.classList.add('preloading');
      account_Details(
        `http://localhost:3000/account/${accountNumber.textContent}`,
        token
      ).then((res) => {
        // console.log(res);
        preloaderWrapper.classList.remove('preloading');
        mainField.innerHTML = '';
        renderAccountDetails(res, token);
      });
    });
  }

  //select
  const selectWrapper = el('div.select-wrapper');
  const select = el('div.select', `Сортировка`);
  const dropdown = el('div.dropdown');
  const checked = el('div.sorting-checked');
  let arr = ['По номеру', 'По балансу', 'По последней транзакции'];
  for (var i of arr) {
    const option = el('div.option', `${i}`);
    mount(dropdown, option);
    option.addEventListener('click', () => {
      select.textContent = option.textContent;
    });
    if (sorting == i) {
      mount(option, checked);
    }
  }
  mount(selectWrapper, select);
  mount(selectWrapper, dropdown);

  if (sorting === 'По номеру') select.textContent = 'По номеру';
  if (sorting === 'По балансу') select.textContent = 'По балансу';
  if (sorting === 'По последней транзакции')
    select.textContent = 'По последней транзакции';

  selectWrapper.addEventListener('click', () => {
    dropdown.classList.toggle('dropdown-open');
    selectWrapper.classList.toggle('select-wrapper-open');
  });

  //сортировка
  selectWrapper.addEventListener('DOMSubtreeModified', () => {
    if (select.textContent === 'По номеру') {
      const newPayload = data.payload.sort(function (a, b) {
        if (a.account > b.account) return -1;
      });
      data.payload = newPayload;
      mainField.innerHTML = '';
      renderAccounts(data, token, 'По номеру');
    }
    if (select.textContent === 'По балансу') {
      const newPayload = data.payload.sort(function (a, b) {
        if (a.balance < b.balance) return -1;
      });
      data.payload = newPayload;
      mainField.innerHTML = '';
      renderAccounts(data, token, 'По балансу');
    }
    if (select.textContent === 'По последней транзакции') {
      const newPayload = data.payload.sort(function (a, b) {
        if (a.transactions.length > 0 && b.transactions.length > 0) {
          const aMaxDate = a.transactions.sort((a, b) => {
            if (a.date > b.date) return -1;
          })[0];
          const bMaxDate = b.transactions.sort((a, b) => {
            if (a.date > b.date) return -1;
          })[0];
          if (aMaxDate < bMaxDate) return -1;
        }
        if (a.transactions.length > 0 && b.transactions.length == 0) {
          return 1;
        }
        if (a.transactions.length == 0 && b.transactions.length > 0) {
          return -1;
        }
        if (a.transactions.length == 0 && b.transactions.length == 0) {
          return 0;
        }
      });
      data.payload = newPayload;
      mainField.innerHTML = '';
      renderAccounts(data, token, 'По последней транзакции');
    }
  });

  mount(sortWrapper, accountTitle);
  mount(sortWrapper, selectWrapper);
  mount(optionWrapper, sortWrapper);
  mount(optionWrapper, addNewAccountBtn);
  mount(listWrapper, accountsList);
  mount(mainField, optionWrapper);
  mount(mainField, listWrapper);

  addNewAccountBtn.addEventListener('click', () => {
    createAccount('http://localhost:3000/create-account', token).then(() => {
      getAccaunts('http://localhost:3000/accounts', token).then((res) => {
        // console.log(data.payload.token);
        mainField.innerHTML = '';
        // renderMenu().accountsBtn.classList.add('active-btn');
        mainField.classList.add('list-styles');
        renderAccounts(res, token);
      });
    });
  });
}
