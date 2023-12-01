import QRCode from 'qrcode';
import { Notification } from './notification';

const displayQrCode = (data) => {
    let error = false;
    const modal = document.querySelector('.modal');
    const canvas = document.querySelector('#qrCanvas');
    const modalClose = document.querySelector('.modal__close');

    QRCode.toCanvas(canvas, data, (err) => {
        if (err) {
            error = true;
            console.error(err);
            return;
        }

        if (error) {
            Notification.getInstance().show('Что-то пошло не так. Попробуйте позже.');
            return;
        }

        console.log('QR-код создан.');
    });

    modal.classList.add('modal__show');

    window.addEventListener('click', ({target}) => {
        if (target === modalClose || target === modal) {
            modal.classList.remove('modal__show');
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }
    });
}

export const showQrController = (performance) => {
    performance.addEventListener('click', ({target}) => {
        if (target.closest('.booking__hall')) {
            const data = target.dataset.booking;
            displayQrCode(data);
        }
    });
}