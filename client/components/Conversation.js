//should be able to display chat from sender to receiver

//npm install react-icons --save

import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { BsEmojiSmileFill } from "react-icons/bs";
import { MdSend } from "react-icons/md";
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom'
import { getFriend, getFriendMessages } from '../store'

const emojis = [
	"😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂",
	"🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗",
	"☺️", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝",
	"🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑",
	"😶", "😶‍🌫️", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😌",
	"😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮",
	"🤧", "🥵", "🥶", "🥴", "😵", "😵‍💫", "🤯", "🤠", "🥳",
	"🥸", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮",
	"😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥",
	"😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫",
	"🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️",
	"💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸",
	"😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉", "🙊",
	"💋", "💌", "💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟",
	"❣️", "💔", "❤️‍🔥", "❤️‍🩹", "❤️", "🧡", "💛",
	"💚", "💙", "💜", "🤎", "🖤", "🤍", "💯", "💢", "💥", "💫",
	"💦", "💨", "🕳️", "💣", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤"
]

const quickEmojis = ['👍', '😍', '🤩', '❤️']

let socket;

const Conversation = ({ user, messages, getFriendMessages, addMessage, getFriend }) => {
	const [text, setText] = useState('');
	const [show, setShow] = useState(false);
	const [ me, setMe ] = useState("");
	// const [messages, setMessages] = useState([]);

	const messagesEnd = useRef();

	const { id } = useParams();

	const roomId = user.id > id ? `${user.id}-${id}`: `${id}-${user.id}`;

	useEffect(() => {
		getFriend(id);
		getFriendMessages(id);

		socket = io()

		socket.emit('createRoom', { roomId })

		socket.on("message", (data) => {
			addMessage(data);
		});
		socket.on("me", (id) => {
			setMe(id)
		})

		return () => socket.emit('forceDisconnect');
	}, [])

	useEffect(() => {
		scrollToBottom();
	}, [messages.friendMessages]);

	const sendMessage = (directText) => {
		const sendText = directText || text.trim();
		if (sendText !== '') {
			socket.emit('message', { text: sendText, senderId: user.id, receiverId: id, roomId });
			addMessage({ id: Date.now(), text: sendText, senderId: user.id, receiverId: id });
			setText('');
		}
	}

	const scrollToBottom = () => {
		if (messagesEnd.current) {
			messagesEnd.current.scrollIntoView({ behavior: "smooth" });
		}
	}

	const handleEmojiClick = (emoji) => {
		setText(prevText => prevText + emoji);
		setShow(false);
	}

	

	return (
		<div className="message-container">
			<div className="message-header">
				<div>
					<IoArrowBackCircleOutline
						style={{ fontSize: 50, color: "#747474" }}
						onClick={() => history.back()}
					/>
				</div>
				<div>{messages.friend && messages.friend.username}</div>

				<div>
					<img className="avatar" src={messages.friend && messages.friend.avatar} alt="avatar" />
				</div>
			</div>
			<div className="message-list">
				{messages.friendMessages.map((message) => (
					<div
						key={message.id}
						className={[
							"message-item",
							message.senderId === user.id ? "me" : "",
						].join(" ")}
					>
						{message.text}
						{
							message.senderId !== user.id && (
								<div className="quick-emojis">
									{
										quickEmojis.map(emoji =>
											<div key={emoji}
											     className="quick-emojis-item"
											     onClick={() => sendMessage(emoji)}>
												{emoji}
											</div>
										)
									}
								</div>
							)
						}
					</div>
				))}
			</div>
			<div style={{ float:"left", clear: "both" }} ref={messagesEnd}></div>
			<div className="message-footer">
				<div className="message-input-wrapper">
					<>
						<BsEmojiSmileFill style={{ color: "#b4b4b4", fontSize: 20, cursor: 'pointer' }} onClick={() => setShow(true)}/>
						{
							show && (
								<>
									<div className="message-emoji-list">
										{
											emojis.map(emoji => <div key={emoji} className="message-emoji-item" onClick={() => handleEmojiClick(emoji)}>{emoji}</div>)
										}
									</div>
									<div className="message-emoji-shadow" onClick={() => setShow(false)}></div>
								</>
							)
						}
					</>
					<div className="message-input">
						<input placeholder="Type message here..."
						       value={text}
						       onChange={e => setText(e.target.value)}
						       onKeyDown={e => e.key === 'Enter' && sendMessage()} />
					</div>
					<div>
						<MdSend style={{ color: "#b3c5e7", fontSize: 20 }} onClick={() => sendMessage()} />
					</div>
				</div>
			</div>
		</div>
	);
};

const mapState = (state) => {
	return {
		user: state.auth,
		messages: state.messages
	};
};
const mapDispatch = (dispatch) => {
	return {
		getFriendMessages: (messageId) => dispatch(getFriendMessages(messageId)),
		addMessage: (message) => dispatch({type: 'CREATE_MESSAGE', message}),
		getFriend: (friendId) => dispatch(getFriend(friendId))
	};
};
export default connect(mapState, mapDispatch)(Conversation);
