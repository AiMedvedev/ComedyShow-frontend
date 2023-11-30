import { createComedianBlock } from "./comediansBlock.js";

export const initChangeSection = (
    eventSection, 
    bookingSection,
    reserveBtn,
    editBtn,
    boopkingTitle,
    bookingForm,
    comedians, 
    comedianList
    ) => {
        const changeSection = () => {
            eventSection.classList.toggle('event__hidden');
            bookingSection.classList.toggle('booking__hidden');

            if(!bookingSection.classList.contains('booking__hidden')) {
                const comedianBlock = createComedianBlock(comedians, comedianList);
                comedianList.append(comedianBlock);
            };
        }

        reserveBtn.style.transition = "opacity .5s, visibility .5s";
        editBtn.style.transition = "opacity .5s, visibility .5s";

        reserveBtn.classList.remove('event__button_hidden');
        editBtn.classList.remove('event__button_hidden');

        reserveBtn.addEventListener('click',() => {
            changeSection();
            boopkingTitle.textContent = 'Забронируйте место в зале';
            bookingForm.method = 'POST';
        });

        editBtn.addEventListener('click', () => {
            changeSection();
            boopkingTitle.textContent = 'Редактирование брони';
            bookingForm.method = 'PATCH';
        });

        return changeSection;
}