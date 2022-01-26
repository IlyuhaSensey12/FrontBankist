'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-01-16T17:01:17.194Z',
    '2022-01-17T23:36:17.929Z',
    '2022-01-18T12:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2022-01-18T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2022-01-18T12:01:20.894Z',
  ],
  currency: 'NIS',
  locale: 'he-IL',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2022-01-18T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const btnNewAcc = document.querySelector('#btn_new_acc');
const newPass = document.querySelector('#new_pass');
const accName = document.querySelector('#acc_name');
const btnCreate = document.querySelector('.btncreate');
const containerSignIn = document.querySelector('.signIn');
const confirmPass = document.querySelector('#new_pass_confirm');
/////////////////////////////////////////////////
//Globar Var
let sorted = false;
let currentAccount, timer;
// Functions
const allowsign = function (b) {
  if (containerSignIn.style.display == `flex`)
    containerSignIn.style.display = `none`;

  if (b === true) {
    btnCreate.style.display = `block`;
  }
  if (b === false) {
    btnCreate.style.display = `none`;
  }
};
//

const formatMovementDate = function (acc, date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / 86400000);
  const DaysPassed = calcDaysPassed(new Date(), date);

  if (DaysPassed === 0) return `Today`;
  if (DaysPassed === 1) return `Yesterday`;
  if (DaysPassed <= 7) return `${DaysPassed} days ago`;
  return new Intl.DateTimeFormat(acc.locale).format(date);
};
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  let movs = acc.movements.slice();
  let times = acc.movementsDates.slice();
  let list = [];
  for (let j = 0; j < movs.length; j++)
    list.push({ mov: movs[j], time: times[j] });
  sort ? list.sort((a, b) => a.mov - b.mov) : '';
  for (let k = 0; k < list.length; k++) {
    movs[k] = list[k].mov;
    times[k] = list[k].time;
  }

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const date = new Date(times[i]);
    const displayDate = formatMovementDate(acc, date);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements">
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
  [...document.querySelectorAll(`.movements__row`)].forEach((row, i) => {
    if (!(i % 2 === 0)) {
      row.style.backgroundColor = '	#f9f9f9';
    }
  });
};
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCur(
    incomes,
    account.locale,
    account.currency
  )}`;

  const expense = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCur(
    Math.abs(expense),
    account.locale,
    account.currency
  )}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${formatCur(
    interest,
    account.locale,
    account.currency
  )}`;
};

const createUserNames = function (accs = accounts) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name.at(0))
      .join('');
  });
};
createUserNames();

const updateUI = function (acc = currentAccount) {
  // Display Movements
  displayMovements(acc, sorted);
  //Display Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
  //Date
  const now = new Date();
  const options = {
    hour: `numeric`,
    minute: `numeric`,
    day: `numeric`,
    month: `numeric`,
    year: `numeric`,
    weekday: `short`,
  };
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);
};

const startLogOutTimer = function () {
  //Set timer
  let time = 300;
  (function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    //In each call, print the remaining to UI
    labelTimer.textContent = `${min}:${sec}`;
    //decrease 1s
    time--;
  })();
  //Call the timer every second
  const timer = setInterval(function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    //In each call, print the remaining to UI
    labelTimer.textContent = `${min}:${sec}`;

    //when 0 secends,stop timerand logout user
    if (time == 0) {
      clearInterval(timer);
      currentAccount = '';
      allowsign(true);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to  get started';
    }
    //decrease 1s
    time--;
  }, 1000);
  return timer;
  //
};

// Event listeners:

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100;
    // Set Time

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    allowsign(false);
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI();
    //
    const htmlARR = [];
    for (const x of accounts) {
      if (x !== currentAccount) htmlARR.push(`<option value="${x.username}">`);
    }
    const html = `${htmlARR.join('\n')}`;
    document
      .querySelector('#accountNames')
      .insertAdjacentHTML('afterbegin', html);
    //
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance >= amount &&
    recieverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);
    //Add transfer Date
    currentAccount.movementsDates.push(new Date());
    recieverAccount.movementsDates.push(new Date());
    updateUI();
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
  clearInterval(timer);
  timer = startLogOutTimer();
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const request = Math.floor(inputLoanAmount.value);
  if (currentAccount.movements.some(mov => mov > 0.1 * request) && request > 0)
    setTimeout(function () {
      currentAccount.movements.push(request);
      currentAccount.movementsDates.push(new Date());
      updateUI();
    }, 2500);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  clearInterval(timer);
  timer = startLogOutTimer();
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const accUserName = inputCloseUsername.value;
  const accPin = Number(inputClosePin.value);
  if (
    accUserName === currentAccount.username &&
    accPin === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex(acc => acc === currentAccount),
      1
    );
    currentAccount = '';
    allowsign(true);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (sorted == false) {
    btnSort.textContent = '';
    btnSort.insertAdjacentHTML(`afterbegin`, 'SORT &#128176;');
  }
  if (sorted == true) {
    btnSort.textContent = '';
    btnSort.insertAdjacentHTML(`afterbegin`, `SORT  &#128337`);
  }
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnCreate.addEventListener('click', function (e) {
  e.preventDefault();
  containerSignIn.style.display = `flex`;
  btnCreate.style.display = `none`;
});
btnNewAcc.addEventListener('click', function (e) {
  e.preventDefault();
  const newUser = accName.value;
  const newUserPass = +newPass.value;
  const confirm = +confirmPass.value;
  if (newUserPass !== confirm) {
    alert(`Password doesn\`t match!`);
  } else {
    const accountNew = {
      owner: newUser,
      movements: [1000],
      interestRate: 1.5,
      pin: newUserPass,

      movementsDates: [new Date()],
      currency: 'USD',
      locale: navigator.language,
    };
    accounts.push(accountNew);
    currentAccount = accountNew;
    createUserNames();
    allowsign(false);
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
    containerApp.style.opacity = `100`;

    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(` `)[0]
    }`;
  }
});
//Fake Logged IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = `100`;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURE
//TODO add currency select Option.
// setInterval(() => {
//   const now = new Date();
//   const hour = now.getHours();
//   const minute = now.getMinutes();
//   const sec = now.getSeconds();
//   console.log(`${hour}:${minute}:${sec}`);
// }, 1000);
