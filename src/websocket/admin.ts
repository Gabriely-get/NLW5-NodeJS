import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";

io.on("connect", async (socket) => {
	const connectionsService = new ConnectionsService();

	const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

	//preciso emitir para todos e nao apenas para quem esta conectado -> io e nao socket
	io.emit("admin_list_all_users", allConnectionsWithoutAdmin);
})