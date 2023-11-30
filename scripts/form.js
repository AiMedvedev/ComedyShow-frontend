import JustValidate from 'just-validate';
import Inputmask from 'inputmask';
import { Notification } from './notification.js';
import { sendData } from './api.js';

export const initForm = (
bookingForm, 
bookingInputFullname,
bookingInputPhone,
bookingInputTicket,
changeSection,
comedianList
) => {
    const notification = Notification.getInstance();
    let notificationMessage = '';
    const validate = new JustValidate(bookingForm, {
        errorFieldCssClass: 'booking__input_invalid',
        successFieldCssClass: 'booking__input_valid'
    });

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
        for (const key in fields) {
            if (!Object.hasOwnProperty.call(fields, key)) {
                continue;
            }

            const element = fields[key];
            if (!element.isValid) {
                notificationMessage += `${element.errorMessage}, `;
            }
        }

        notification.show(notificationMessage.slice(0, -2), false);
    });

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validate.isValid) {
            return;
        }

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
        });

        if (data.booking.length == 0 && !notificationMessage) {
            notificationMessage += "Выберите комика, "; 
            notification.show(notificationMessage.slice(0, -2), false);
            return;
        }
        
        if (times.size !== data.booking.length) {
            notificationMessage += "Нельзя одновременно быть в двух местах!"; 
            notification.show(notificationMessage.slice(0, -2), false);
            return;
        }

        notificationMessage = '';
        const method = bookingForm.getAttribute('method');
        let isSent = false;

        if (method === 'PATCH') {
            isSent = await sendData(method, data, data.ticket);
        }

        if (method === 'POST') {
            isSent = await sendData(method, data);
        }

        if (isSent) {
            Notification.getInstance().show('Бронь принята!', true);
            changeSection();
            bookingForm.reset();
            comedianList.textContent = '';
        }
    });
}