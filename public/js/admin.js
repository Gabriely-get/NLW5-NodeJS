const socket = io();
let connectionsUsers = [];

socket.on("admin_list_all_users", (connections) => {
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

	const template = document.getElementById("admin_template").innerHTML;

	const rendered = Mustache.render(template, {
		email: connection.user.email,
		id: connection.user_id
	});

	document.getElementById("supports").innerHTML += rendered;

	const params = {
		user_id: connection.user_id
	}

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
		console.log(divMessages);
	});
}