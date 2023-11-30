import './style.css'

import { getComedians } from './scripts/api.js';
import { initForm } from './scripts/form.js';
import { createComedianBlock } from './scripts/comediansBlock.js';
import { initChangeSection } from './scripts/changeSection.js';

const comedianList = document.querySelector('.booking__comedians-list');
const bookingForm = document.querySelector('.booking__form');


const init = async () => {
    const comedians = await getComedians();

    const comediansNumber = document.querySelector(".event__info-item_number-comedians");
    const bookingInputFullname = document.querySelector('.booking__input_fullName');
    const bookingInputPhone = document.querySelector('.booking__input_phone');
    const bookingInputTicket = document.querySelector('.booking__input_ticket');

    const eventSection = document.querySelector('.event');
    const bookingSection = document.querySelector('.booking');
    const reserveBtn = document.querySelector('.event__button-reserve');
    const editBtn = document.querySelector('.event__button-edit');
    const boopkingTitle = document.querySelector('.booking__title');

    
    if (comedians) {
        

        comediansNumber.textContent = comedians.length;

        

        const changeSection = initChangeSection(
            eventSection, 
            bookingSection,
            reserveBtn,
            editBtn,
            boopkingTitle,
            bookingForm,
            comedians, 
            comedianList
        );
        
        initForm(
            bookingForm, 
            bookingInputFullname,
            bookingInputPhone,
            bookingInputTicket,
            changeSection,
            comedianList
        );
    
    }
}

init();