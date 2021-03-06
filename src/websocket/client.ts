import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";
import { MessagesService } from "../services/MessagesService";

interface IParams {
	text: string;
	email: string;
}

io.on("connect", (socket) => {

	const connectionsService = new ConnectionsService();
	const usersService = new UsersService();
	const messagesService = new MessagesService();

	socket.on("client_first_access", async (params) => {
		const socketId = socket.id;
		const { text, email } = params as IParams;
		let user_id = null;

		const userExists = await usersService.findByEmail(email);

		if(!userExists) {
			const user = await usersService.create(email);

			await connectionsService.create({
				socket_id: socketId,
				user_id: user.id
			});

			user_id = user.id;
		} else {
			const connection = await connectionsService.findUserById(userExists.id);
			user_id = userExists.id;

			if(!connection) {

				await connectionsService.create({
					socket_id: socketId,
					user_id: userExists.id
				});
			} else {
				//se o usuario ja se conectou e foi atendido em todas,
				//uma nova conexao é criada, mas se houver uma conexao dele nao atendida
				//o socket dele deve ser atualizado para nao ser duplicado na lista dos admins

				const userAdminIsNull = await connectionsService.findUserWithoutAdmin(user_id);
				connection.socket_id = socket.id;

				if(!userAdminIsNull) {

					connection.admin_id = null;
					await connectionsService.create(connection);

				} else {

					let userid = connection.user_id;
					await connectionsService.updateSocketId(socketId, userid);
					
				}
			}
		}

		await messagesService.create({
			text,
			user_id
		});

		const allMessages = await messagesService.listByUser(user_id);
		const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

		socket.emit("client_list_all_messages", allMessages);

		//atualiza automaticamente a lista de usuario sem atendimento na pagina do admin
		io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

		// Salvar a conexao do usuario com o socket_id &
		// Salvar uma conexao existente com socket_id diferente
	});

	socket.on("client_send_to_admin", async (params) => {
		const { text, socket_admin_id } = params;
		const socket_id = socket.id;
		const { user_id } = await connectionsService.findBySocketId(socket_id);

		const message = await messagesService.create({
			text,
			user_id,
		});

		io.to(socket_admin_id).emit("admin_receive_message", {
			message,
			socket_id
		});
	});
});