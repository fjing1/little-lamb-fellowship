document.getElementById("userForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    // Get user input values
    const name = document.getElementById("name").value;
    const attribute = document.getElementById("attribute").value;
    const wechat = document.getElementById("wechat").value;
    const email = document.getElementById("email").value;

    // Display the saved user info
    const userList = document.getElementById("userItems");
    const listItem = document.createElement("li");
    listItem.textContent = `Name: ${name}, Attribute: ${attribute}, WeChat: ${wechat}, Email: ${email}`;
    userList.appendChild(listItem);

    // Clear the form after submission
    document.getElementById("userForm").reset();
});