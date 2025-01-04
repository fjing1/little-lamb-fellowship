const form = document.getElementById('userForm');
const userList = document.getElementById('userItems');
const maxUsers = 100;
let users = JSON.parse(localStorage.getItem('users')) || [];

function saveUsersToFile() {
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'users.json';
    a.click();
}

function renderUsers() {
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${user.name} - ${user.attribute}`;
        userList.appendChild(li);
    });
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (users.length >= maxUsers) {
        alert('Maximum number of users reached!');
        return;
    }

    const name = form.name.value.trim();
    const attribute = form.attribute.value.trim();

    if (!name || !attribute) {
        alert('Please fill out all fields.');
        return;
    }

    users.push({ name, attribute });
    localStorage.setItem('users', JSON.stringify(users));

    renderUsers();
    form.reset();
    saveUsersToFile();
});

renderUsers();
