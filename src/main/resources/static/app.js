'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var addGroup = document.querySelector('#addGroup');
var groupName = document.querySelector('#groupName');

var stompClient = null;
var username = null;
var group="public";

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

window.onload = getGroupAction;
document.getElementById("currentGroup").innerHTML = "Current Group: " + group

function connect(event) {
    username = document.querySelector('#name').value.trim();

    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {
    stompClient.subscribe('/topic/group/' + group  , onMessageReceived);

    stompClient.send("/app/chat.addUser/" + group ,
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}

function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage/" + group, {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
        const ul = document.getElementById('usersList');
        const li = document.createElement("li"); 
        li.innerHTML = message.sender; 
        ul.appendChild(li); 
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

function addGroupAction() { 
  var formData = new FormData(); 
  var groupValue = groupName.value.trim();
  formData.append("name", groupValue)
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:8089/api/groups");
  xhttp.send(formData);
  setTimeout(
    function () {
      getGroupAction();
    }, 3);
}

function getGroupAction() { 
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      var groupsJson=JSON.parse(this.responseText)
      const ul = document.getElementById('groupsList');
      ul.innerHTML = "";
      for(var i=0;i<groupsJson.length;i++){
        const li = document.createElement("li"); 
        li.innerHTML = groupsJson[i].name; 
        ul.appendChild(li); 
        (function(value){
            li.addEventListener("click", function() {
                changeGroup(value)
            }, false);})(groupsJson[i].name);
      }   
    }

    xhttp.open("Get", "http://localhost:8089/api/groups");
    xhttp.send();
}

function changeGroup(groupName){
   stompClient.unsubscribe('/topic/group/' + group, onMessageReceived);
    stompClient.disconnect()
   group = groupName
   document.getElementById("currentGroup").innerHTML = "Current Group: " + groupName
   setTimeout(() => {
    messageArea.innerHTML=""
      connect()
      onConnected() 
   }, 5);
   
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)
addGroup.addEventListener("click", addGroupAction);
