'use strict';

const myForm = document.querySelectorAll('form'),
    container = document.querySelector('.container'),
    save = document.querySelector('.save'),
    remove = document.querySelector('.remove'),
    create = document.querySelector('#create');


fetch('http://localhost:3000/myBase') // отображение на странице
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if (data.length > 0) {
            data.forEach(({ InputName, checkbox, id }) => {
                const element = document.createElement('div');
                element.innerHTML = `
                <form name="myForm" id="${id}">
                    <input type="text" name="InputName" value="${InputName}">
                    <input type="checkbox" name="checkbox" checked=${checkbox}><br>
                    <button type="submit" class="save">Save</button>
                    <button type="" class="remove">Remove</button>
                </form>`;
                document.querySelector('container').append(element);
            });
        }
    });

function createNewTable() { // создание таблицы
    create.addEventListener('click', (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/myBase', {
                method: 'POST',
                body: JSON.stringify({ InputName: '', checkbox: '', id: '' }),
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .then(response => response.json());
    });
}

const postChanges = async(url, data) => { //постинг изменений
    let res = await fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });
    return await res.json();
};

function saveChanges() { //сохранение изменений
    document.querySelector('.container').addEventListener('click', (e) => {
        if (e.target && e.target.matches('.save')) {
            e.preventDefault();

            const formData = new FormData(e.target.parentElement);
            const object = JSON.stringify(Object.fromEntries(formData.entries()));

            fetch('http://localhost:3000/myBase')
                .then(res => res.json())
                .then(json => {
                    for (let i = 0; i < json.length; i++) {
                        if (e.target.parentElement.id == json[i].id) {
                            postChanges('http://localhost:3000/myBase/' + json[i].id, object);
                        }
                    }
                });
        }
    });
}

function deleteTable() { //удаление таблицы
    document.querySelector('.container').addEventListener('click', e => {
        if (e.target && e.target.matches('.remove')) {
            e.preventDefault();
            fetch('http://localhost:3000/myBase')
                .then(res => res.json())
                .then(json => {
                    for (let i = 0; i < json.length; i++) {
                        if (e.target.parentElement.id == json[i].id) {
                            fetch('http://localhost:3000/myBase/' + json[i].id, {
                                method: 'DELETE',
                            });
                        }
                    }
                });
        }
    });
}

saveChanges();
createNewTable();
deleteTable();