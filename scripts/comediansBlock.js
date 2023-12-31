import TomSelect from 'tom-select';

const MAX_COMEDIANS = 6;

export const createComedianBlock = (comedians, comedianList) => {
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
            const nextComediansBlock = createComedianBlock(comedians, comedianList);
            comedianList.append(nextComediansBlock);
        }

        tomSelectTime.off('change');
    }

    tomSelectTime.on('change', createNewShowBooking);

    return comedian;
}