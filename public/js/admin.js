const socket = io();
let connectionsUsers = [];
let userSocket = null;

socket.on("admin_list_all_users", (connections) => {
	console.log(connections);
	connectionsUsers = connections;
	document.getElementById("list_users").innerHTML = "";

	let template = document.getElementById("template").innerHTML;

	connections.forEach((connection) => {
		const rendered = Mustache.render(template, {
			email: connection.user.email,
			id: connection.socket_id
		});
		
		document.getElementById("list_users").innerHTML += rendered;
	});

});

function call(id) {
	//carrega chat para suporte
	const connection = connectionsUsers.find(connection => connection.socket_id === id);
	userSocket = connection.socket_id;
	console.log('userSocket: ', userSocket);
	const template = document.getElementById("admin_template").innerHTML;

	const rendered = Mustache.render(template, {
		email: connection.user.email,
		id: connection.user_id
	});

	document.getElementById("supports").innerHTML += rendered;

	const params = {
		user_id: connection.user_id
	};

	socket.emit("admin_user_in_support", params);

	//carrega as mensagens do chat
	socket.emit("admin_list_messages_by_users", params, messages => {
		const divMessages = document.getElementById(`allMessages${connection.user_id}`);

		//essas mensagens vem do callback deste emit

		messages.forEach((message) => {
		const createDiv = document.createElement("div");

			if(message.admin_id === null) {
				createDiv.className = "admin_message_client";

				createDiv.innerHTML = `<span>${connection.user.email}</span>`;
				createDiv.innerHTML += `<span>${message.text}</span>`;
				createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;
			} else {
 				createDiv.className = "admin_message_admin";

				createDiv.innerHTML += `Atendente: <span>${message.text}</span>`;
				createDiv.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format("DD/MM/YY HH:mm:ss")}</span>`;
 			
 			}


			divMessages.appendChild(createDiv);
		});
	});
}

function sendMessage(id) {
	const text = document.getElementById(`send_message_${id}`);
	const socket_id = userSocket;

	const params = {
		text: text.value,
		user_id: id,
		socket_id
	};

	socket.emit("admin_send_message", params);

	const divMessages = document.getElementById(`allMessages${id}`);
	const createDiv = document.createElement("div");

	createDiv.className = "admin_message_admin";

	createDiv.innerHTML += `Atendente: <span>${params.text}</span>`;
	createDiv.innerHTML += `<span class="admin_date">${dayjs().format("DD/MM/YY HH:mm:ss")}</span>`;
	
	divMessages.appendChild(createDiv);

	text.value = "";
}

socket.on("admin_receive_message", async data => {
	// console.log(data);
	const conne = await connectionsUsers.findOne(connection => connection.socket_id === data.socket_id);
	console.log(conne, data.socket_id);
	const divMessages = document.getElementById(`allMessages${data.message.user_id}`);
	const createDiv = document.createElement("div");

	createDiv.className = "admin_message_client";

	createDiv.innerHTML = `<span>${conne.user.email}</span>`;
	createDiv.innerHTML += `<span>${data.message.text}</span>`;
	createDiv.innerHTML += `<span class="admin_date">${dayjs(data.message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;

	divMessages.appendChild(createDiv);
});