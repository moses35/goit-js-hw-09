import Notiflix from 'notiflix';
const form = document.querySelector('.form');

form.addEventListener('submit', onFormSubmit);

//form submit
function onFormSubmit(event) {
  event.preventDefault();
  const { amount, delay, step } = event.currentTarget.elements;

  let promiseAmount = Number(amount.value);
  let promiseDelay = Number(delay.value);
  let promiseStep = Number(step.value);

  for (let i = 1; i <= promiseAmount; i += 1) {
    createPromise(i, promiseDelay)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(
          `✅ Fulfilled promise ${position} in ${delay}ms`
        );
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(
          `❌ Rejected promise ${position} in ${delay} ms`
        );
      });
    promiseDelay += promiseStep;
  }
}

//create Promise
function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
