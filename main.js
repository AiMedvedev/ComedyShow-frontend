import './style.css'

import { getComedians } from './scripts/api.js';
import { initForm } from './scripts/form.js';
import { createComedianBlock } from './scripts/comediansBlock.js';

const comedianList = document.querySelector('.booking__comedians-list');
const bookingForm = document.querySelector('.booking__form');

const init = async () => {
    const comedians = await getComedians();

    const comediansNumber = document.querySelector(".event__info-item_number-comedians");
    const bookingInputFullname = document.querySelector('.booking__input_fullName');
    const bookingInputPhone = document.querySelector('.booking__input_phone');
    const bookingInputTicket = document.querySelector('.booking__input_ticket');

    initForm(
        bookingForm, 
        bookingInputFullname,
        bookingInputPhone,
        bookingInputTicket
    );

    if (comedians) {
        const comedianBlock = createComedianBlock(comedians, comedianList);
        
        comediansNumber.textContent = comedians.length;
        comedianList.append(comedianBlock);
    }
}

init();