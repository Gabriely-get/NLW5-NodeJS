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

			let con = await connectionsService.create({
				socket_id: socketId,
				user_id: user.id
			});

			user_id = user.id;
		} else {
			const connection = await connectionsService.findUserById(userExists.id);
			user_id = userExists.id;

			if(!connection) {

				let con = await connectionsService.create({
					socket_id: socketId,
					user_id: userExists.id
				});

			} else {
				connection.socket_id = socketId;

				await connectionsService.create(connection);
			}
		}

		await messagesService.create({
			text,
			user_id
		});

		// Salvar a conexao do usuario com o socket_id &
		// Salvar a mesma conexao desse mesmo user com socket_id diferente
	});
});