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
});