import JustValidate from 'just-validate';
import Inputmask from 'inputmask';
import { Notification } from './notification.js';

export const initForm = (
bookingForm, 
bookingInputFullname,
bookingInputPhone,
bookingInputTicket
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
        });

        if (times.size !== data.booking.length) {
            notificationMessage += "Нельзя одновременно быть в двух местах!"; 
            notification.show(notificationMessage.slice(0, -2), false);
            notificationMessage = '';
        }
    });
}