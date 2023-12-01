import { Notification } from './notification.js';

const API_URL = 'https://adjoining-indigo-triangle.glitch.me/';

export const getComedians = async () => {
    try {
        const response = await fetch(`${API_URL}comedians`);
        if(!response.ok) {
            throw new Error(`Сервер вернул ошибку: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Возникла проблема с fetch-запросом: ${error}`);
        Notification.getInstance().show('Возникла ошибка сервера, попробуйте позже');
    }
}

export const sendData = async (method, data, id) => {
    const thisId = id ? `/${id}` : "";
    try {
        const response = await fetch(`${API_URL}clients${thisId}`, {
            method,
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        });

        if(!response.ok) {
            throw new Error(`Сервер вернул ошибку: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error(`Возникла проблема с fetch-запросом: ${error}`);
        Notification.getInstance().show('Возникла ошибка сервера, попробуйте позже');

        return false;
    }
}

export const getClient = async (ticket) => {
    try {
        const response = await fetch(`${API_URL}clients/${ticket}`);
        if(!response.ok) {
            throw new Error(`Сервер вернул ошибку: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Возникла проблема с fetch-запросом: ${error}`);
        Notification.getInstance().show('Возникла ошибка сервера, попробуйте позже');
    }
}
