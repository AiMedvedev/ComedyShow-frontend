import { getClient, getComedians } from "./api";
import { displayBookingInfo, displayClientInfo } from "./display";
import { Notification } from "./notification";
import { showQrController } from "./showQrController";

const getTicketNumber = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return urlParams.get("t");
}

export const initQrPage = async () => {
    const clientInfo = document.querySelector('.booking__client-info');
    const performances = document.querySelector('.booking__performances');

    const ticketNumber = getTicketNumber();
    
    if (ticketNumber) {
        const clientData = await getClient(ticketNumber);
        displayClientInfo(clientInfo, clientData);

        const comediansData = await getComedians();
        displayBookingInfo(performances, clientData, comediansData);

        showQrController(performances);
    } else {
        Notification.getInstance().show('Произошла ошибка. Проверьте ссылку.');
    }
}