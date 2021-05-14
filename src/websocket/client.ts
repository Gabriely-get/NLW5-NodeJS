import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";

io.on("connect", (socket) => {

	const connectionsService = new ConnectionsService();
	const usersService = new UsersService();

	socket.on("client_first_access", async (params) => {
		const socketId = socket.id;
		const { text, email } = params;

		const userExists = await usersService.findByEmail(email);

		if(!userExists) {
			const user = await usersService.create(email);

			let con = await connectionsService.create({
				socket_id: socketId,
				user_id: user.id
			});
		} else {
			const connection = await connectionsService.findUserById(userExists.id);

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

		// Salvar a conexao do usuario com o socket_id &
		// Salvar a mesma conexao desse mesmo user com socket_id diferente
	});
});