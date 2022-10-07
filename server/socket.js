const app = require('./app')
const {db} = require('./db')
const server = require('http').createServer(app);


const io = require("socket.io")(server)


io.on('connection', (socket) => {
	console.log('connect...')

	socket.on('createRoom', (data) => {
		socket.join(data.roomId);
	});

	socket.on('message', async (data) => {
		const message = await db.models.user.prototype.addMessage({
			text: data.text,
			senderId: data.senderId,
			receiverId: data.receiverId,
			date: new Date()
		});
		socket.to(data.roomId).emit("message", message);
		socket.broadcast.emit("messages", message);
	});

	socket.on('createPost', async (creatorId) => {
		socket.broadcast.emit("createPost", creatorId);
	});

	socket.on('forceDisconnect', () => {
		socket.disconnect();
	});

	socket.emit("me", socket.id);


	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});

	socket.on("createUser", (data) => {
		socket.broadcast.emit("createUser", data);
	});
});




module.exports = server;
