export const displayClientInfo = (parent, data) => {
    parent.innerHTML += `
        <p class="booking__client-item">Имя: ${data.fullName}</p>
        <p class="booking__client-item">Телефон: ${data.phone}</p>
        <p class="booking__client-item">Номер билета: ${data.ticket}</p>
    `;
}

export const displayBookingInfo = (parent, clientData, comediansData) => {
    const bookingList = document.createElement('ul');
    bookingList.classList.add('booking__list');

    const bookingComedians = clientData.booking.map((bookingComedian) => {
        const comedian = comediansData.find(
            (item) => item.id === bookingComedian.comedian,
        );

        const show = comedian.performances.find(
            (item) => /* {
                console.log(bookingComedian.time);
                console.log(item.time);
            }  */bookingComedian.time.trim() === item.time,
        );

        return {
            comedian,
            show
        };
    });

    bookingComedians.sort((a, b) => a.show.time.localeCompare(b.show.time));
    
    const comedianElements = bookingComedians.map(({comedian, show}) => {
        const comedianElement = document.createElement('li');
        comedianElement.classList.add('booking__item');
        comedianElement.innerHTML = `
            <h3>${comedian.comedian}</h3>
            <p>Время: ${show.time}</p>
            <button class="booking__hall" type="button" 
                data-booking="${clientData.fullName} ${clientData.ticket} ${comedian.comedian} ${show.time} ${show.hall}">
                    ${show.hall}
            </button>
        `;

        return comedianElement;
    });

    bookingList.append(...comedianElements);
    parent.append(bookingList);
}
