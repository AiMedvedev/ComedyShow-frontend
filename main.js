import './style.css'
import TomSelect from 'tom-select';
import { Notification } from './scripts/notification.js';
import Inputmask from 'inputmask';
import JustValidate from 'just-validate';

const comedianList = document.querySelector('.booking__comedians-list');
const MAX_COMEDIANS = 6;
const bookingForm = document.querySelector('.booking__form');
const notification = Notification.getInstance();

/* setTimeout(() => {
    notification.show("hello", false);
}, 3000) */
//console.log(notification);

const createComedianBlock = (comedians) => {
    const comedian = document.createElement('li');
    const comedianSelect = document.createElement('select');
    const timeSelect = document.createElement('select');
    const inputHidden = document.createElement('input');
    const bookingHall = document.createElement('button');
    
    comedian.classList.add("booking__comedian");
    comedianSelect.classList.add("booking__select", "booking__select_comedian");
    timeSelect.classList.add("booking__select", "booking__select_time");
    bookingHall.classList.add("booking__hall");
    bookingHall.type = "button";
    inputHidden.type = "hidden";
    inputHidden.name = "booking";
    inputHidden.id = "booking";

    comedian.append(comedianSelect, timeSelect, inputHidden);

    const tomSelectComedian = new TomSelect(comedianSelect, {
        hideSelected: true,
        placeholder: 'Выбрать комика',
        options: comedians.map(c => ({
            value: c.id,
            text: c.comedian
        }))
    });

    const tomSelectTime = new TomSelect(timeSelect, {
        hideSelected: true,
        placeholder: 'Время' 
    });

    tomSelectTime.disable();
    tomSelectComedian.on('change', (id) => {
        tomSelectTime.enable();
        tomSelectComedian.blur();
        const {performances} = comedians.find(item => item.id === id);
        tomSelectTime.clear();
        tomSelectTime.clearOptions();
        tomSelectTime.addOptions(performances.map(item =>({
            value: item.time,
            text: item.time
        })));
        bookingHall.remove();
    });

    tomSelectTime.on('change', (time) => {
        if (!time) {
            return
        }

        const comedianId = tomSelectComedian.getValue();
        const {performances} = comedians.find(item => item.id === comedianId);
        const {hall} = performances.find(item => item.time === time);

        inputHidden.value = `${comedianId}, ${time}`;
        tomSelectTime.blur();
        bookingHall.textContent = hall;
        comedian.append(bookingHall);

    });

    const createNewShowBooking = () => {
        if (comedianList.children.length < MAX_COMEDIANS) {
            const nextComediansBlock = createComedianBlock(comedians);
            comedianList.append(nextComediansBlock);
        }

        tomSelectTime.off('change');
    }

    tomSelectTime.on('change', createNewShowBooking);

    return comedian;
}

const getComedians = async () => {
    const response = await fetch('http://localhost:8080/comedians');
    return response.json();
}

const init = async () => {
    const comedians = await getComedians();
    const comedianBlock = createComedianBlock(comedians);

    comedianList.append(comedianBlock);

    const comediansNumber = document.querySelector(".event__info-item_number-comedians");
    
    comediansNumber.textContent = comedians.length;
    comedianList.append(comedianBlock);

    const validate = new JustValidate(bookingForm, {
        errorFieldCssClass: 'booking__input_invalid',
        successFieldCssClass: 'booking__input_valid'
    });

    const bookingInputFullname = document.querySelector('.booking__input_fullName');
    const bookingInputPhone = document.querySelector('.booking__input_phone');
    const bookingInputTicket = document.querySelector('.booking__input_ticket');

    new Inputmask('+7(999)-999-9999').mask(bookingInputPhone);
    new Inputmask('99999999').mask(bookingInputTicket);

    validate
        .addField(bookingInputFullname, [
            {
            rule: 'required',
            errorMessage: 'Заполните имя'
            }
        ])
        .addField(bookingInputPhone, [
            {
            rule: 'required',
            errorMessage: 'Заполните телефон'
            },
            {
            validator() {
                const phone = bookingInputPhone.inputmask.unmaskedvalue();
                return phone.length === 10; 
            },
            errorMessage: "Некорректный телефон"
            },
        ])
        .addField(bookingInputTicket, [
            {
            rule: 'required',
            errorMessage: 'Заполните номер билета'
            },
            {
            validator() {
                const ticket = bookingInputTicket.inputmask.unmaskedvalue();
                return ticket.length === 8; 
            },
            errorMessage: "Некорректный номер билета"
            },
        ])
        .onFail((fields) => {
            let errorMessage = '';
            for (const key in fields) {
                if (!Object.hasOwnProperty.call(fields, key)) {
                    continue;
                }

                const element = fields[key];
                if (!element.isValid) {
                    errorMessage += `${element.errorMessage}, `;
                }
            }

            notification.show(errorMessage.slice(0, -2), false);
        });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = {booking: []};
        const times = new Set();

        new FormData(bookingForm).forEach((value, field) => {
            
            if (field === 'booking') {
                const [comedian, time] = value.split(",");

                if (comedian && time) {
                    data.booking.push({comedian, time});
                    times.add(time);
                }   
            } else {
                data[field] = value;
            } 
            
            if (times.size !== data.booking.length) {
                notification.show("Нельзя одновременно быть в двух местах!", false);
            }

        });
    });
}

init();