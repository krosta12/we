/* eslint-disable no-magic-numbers */
const requestUrl = 'https://jsonplaceholder.typicode.com/users';
let loadByJsButton = document.querySelector('.load-by-js');
let loadByFetchButton = document.querySelector('.load-by-fetch');
let xhrContainer = document.querySelector('.jsContainer') ;
let fetchContainer = document.querySelector('.fetchContainer');
let isFetching = false;
let loader = document.createElement('div');
loader.classList.add('loader');



function requestWithXhr(method, url) {
    document.querySelector('body').prepend(loader);
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.send();
        xhr.onload = () => {
            if(xhr.status >= 400) {
                reject(xhr.response)
            }else {
                resolve(JSON.parse(xhr.response))
            }
        }
    })
    
}

async function getRequestWithFetch(url) {
    document.querySelector('body').prepend(loader);
    let response = await fetch(url);
    return await response.json();
}

async function updateInfo(userId) {
    document.querySelector('body').prepend(loader);
    await fetch(requestUrl + `/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: userId,
            name: document.getElementById(`${userId}`).querySelector('input').value
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then((response) => response.json())
    .then(response => {
        document.getElementById(`${userId}`).querySelector('p').innerText = response.name
    });
    document.querySelector('.loader').remove();
}

async function deleteInfo(userId) {
    document.querySelector('body').prepend(loader);
    isFetching = true;
    await fetch(requestUrl + `/${userId}`, {
        method: 'DELETE'
    });
    isFetching = false;
    window.alert(`User with id - ${userId} was deleted`);
    document.getElementById(`${userId}`).style.display = 'none';
    document.querySelector('.loader').remove();
}

loadByJsButton.onclick = () => {
    requestWithXhr('GET', requestUrl)
    .then(data => {
        xhrContainer.innerHTML = data.map(el => {
            return `<div class='user-name'><p>${el.name}</p></div>`
        }).join('');
        document.querySelector('.loader').remove();
    })
}

loadByFetchButton.onclick = () => {
    getRequestWithFetch(requestUrl)
    .then(data => {
        fetchContainer.innerHTML = data.map(el => {
            return `<div class='user-name' id=${el.id}>
                <p>${el.name}</p>
                <div class='user-buttons'>
                    <button class='edit-button' onclick="toggleInput(${el.id})">Edit</button>
                    <button class='delete-button' onclick="deleteInfo(${el.id})">Delete</button>
                </div>
                <div class='changeInfo-${el.id} hidden'>
                    <input type='text'/>
                    <button class='save-button' onclick="updateInfo(${el.id})">Save</button>
                </div>
            </div>`
        }).join('');
        document.querySelector('.loader').remove();
    })
}


function toggleInput(el) {
    let container = document.querySelector(`.changeInfo-${el}`);
    if (container.style.display === 'block') {
        container.style.display = 'none';
    } else {
        container.style.display = 'block';
    }
}