import 'reflect-metadata';
import express from 'express';
import { createServer } from "http";
import { Server, Socket } from "socket.io" 
import path from "path"; //constroi o caminho de algum arquivo

import './database';
import { routes } from './routes';

const app = express();

app.use(express.static(path.join(__dirname, "..", "public"))); //define onde esta os arquivos publicos
app.set("views", path.join(__dirname, "..", "public")); //o caminho que esta minhas views
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/pages/client", (request, response) => { //renderiza o arquivo html
	return response.render("html/client.html");
});

app.get("/pages/admin", (request, response) => {
	return response.render("html/admin.html");
});

const http = createServer(app); //criando protocolo http
const io = new Server(http); //criando protocolo ws

io.on("connection", (socket: Socket) => {
	// console.log("Se conectou", socket.id);
});

app.use(express.json());
app.use(routes);

export { http, io };