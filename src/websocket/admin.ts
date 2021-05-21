import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";

io.on("connect", async (socket) => {
	const connectionsService = new ConnectionsService();
	const messagesService = new MessagesService();

	const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

	//preciso emitir para todos e nao apenas para quem esta conectado -> io e nao socket
	io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

	//preciso retornar as mensagens de um usuario especifico, cada vez que emitirem -> socket
	socket.on("admin_list_messages_by_users", async (params, callback) => {
		const { user_id } = params;

		const allMessages = await messagesService.listByUser(user_id);

		callback(allMessages);
	});

	socket.on("admin_send_message", async (params) => {
		const { text, user_id, socket_id } = params;

		let m = await messagesService.create({
			text,
			user_id,
			admin_id: socket.id
		});

		// const { socket_id } = await connectionsService.findUserById(user_id);
		console.log('socketUsernapagAd: ', socket_id);
		console.log('socketAdmin: ', socket.id);
		console.log('mensAd pag Ad: ', m);
		// mando mensagem para o socket especifico do usuario emitindo um evento
		io.to(socket_id).emit("admin_send_to_client", {
			text,
			socket_id: socket.id
		});
	});

	socket.on("admin_user_in_support", async params => {
		const { user_id } = params;
		const socket_id = socket.id;

		await connectionsService.updateAdminId({user_id, socket_id});
		io.emit("admin_list_all_users", allConnectionsWithoutAdmin);
	});
});