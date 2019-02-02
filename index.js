const btns = document.querySelectorAll('button');
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input = document.querySelector('input');
const error = document.querySelector('.error');

var activity = 'coding';

btns.forEach(btn => {
    btn.addEventListener('click', e => {
        // get activity
        activity = e.target.dataset.activity;

        //remove and add active class
        btns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');

        // set id of input field
        input.setAttribute('id', activity);

        // set text of form span
        formAct.textContent = activity;

        update(data);
    })

})

// form submit
form.addEventListener('submit', e => {
    e.preventDefault();

    const amount = parseInt(input.value);
    if (amount) {
        db.collection('activity').add({
            amount,
            activity,
            date: new Date().toString()
        }).then(() => {
            error.textContent = '';
            input.value = '';
        })
    } else {
        error.textContent = 'please enter a valid amount';
    }


})