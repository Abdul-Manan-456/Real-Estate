
const socket = io();


const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');

// QUERY STRING
const queryString = window.location.search.substring(1).split('&');
const data = {}

queryString.forEach(param => {
    let [key, value] = param.split('=');

    if (value.includes('+')) {
        value = value.replace('+', ' ')
    }
    data[key] = value

})

const loginUser = async (data) => {
    return await axios.post('http://localhost:3000/api/v1/user', data)
}

const { username, room } = data



// join room chat messages
socket.emit('join', ({ username, room }), (error) => {
    console.log(error)
})

socket.on('message', (message) => {



    // Message from the Server
    console.log(message);
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let msg = e.target.elements.msg.value;
        msg = msg.trim();

        if (!msg) {
            return false;
        }

        // Message to the Server
        socket.emit('sendMessage', msg)

        // Clear and Focus the input
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
    });
});


function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`

    document.querySelector('.chat-messages').appendChild(div)
}

