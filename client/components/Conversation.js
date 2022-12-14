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
	"๐", "๐", "๐", "๐", "๐", "๐", "๐คฃ", "๐", "๐",
	"๐", "๐", "๐", "๐", "๐ฅฐ", "๐", "๐คฉ", "๐", "๐",
	"โบ๏ธ", "๐", "๐", "๐ฅฒ", "๐", "๐", "๐", "๐คช", "๐",
	"๐ค", "๐ค", "๐คญ", "๐คซ", "๐ค", "๐ค", "๐คจ", "๐", "๐",
	"๐ถ", "๐ถโ๐ซ๏ธ", "๐", "๐", "๐", "๐ฌ", "๐ฎโ๐จ", "๐คฅ", "๐",
	"๐", "๐ช", "๐คค", "๐ด", "๐ท", "๐ค", "๐ค", "๐คข", "๐คฎ",
	"๐คง", "๐ฅต", "๐ฅถ", "๐ฅด", "๐ต", "๐ตโ๐ซ", "๐คฏ", "๐ค ", "๐ฅณ",
	"๐ฅธ", "๐", "๐ค", "๐ง", "๐", "๐", "๐", "โน๏ธ", "๐ฎ",
	"๐ฏ", "๐ฒ", "๐ณ", "๐ฅบ", "๐ฆ", "๐ง", "๐จ", "๐ฐ", "๐ฅ",
	"๐ข", "๐ญ", "๐ฑ", "๐", "๐ฃ", "๐", "๐", "๐ฉ", "๐ซ",
	"๐ฅฑ", "๐ค", "๐ก", "๐ ", "๐คฌ", "๐", "๐ฟ", "๐", "โ ๏ธ",
	"๐ฉ", "๐คก", "๐น", "๐บ", "๐ป", "๐ฝ", "๐พ", "๐ค", "๐บ", "๐ธ",
	"๐น", "๐ป", "๐ผ", "๐ฝ", "๐", "๐ฟ", "๐พ", "๐", "๐", "๐",
	"๐", "๐", "๐", "๐", "๐", "๐", "๐", "๐", "๐", "๐",
	"โฃ๏ธ", "๐", "โค๏ธโ๐ฅ", "โค๏ธโ๐ฉน", "โค๏ธ", "๐งก", "๐",
	"๐", "๐", "๐", "๐ค", "๐ค", "๐ค", "๐ฏ", "๐ข", "๐ฅ", "๐ซ",
	"๐ฆ", "๐จ", "๐ณ๏ธ", "๐ฃ", "๐ฌ", "๐๏ธโ๐จ๏ธ", "๐จ๏ธ", "๐ฏ๏ธ", "๐ญ", "๐ค"
]

const quickEmojis = ['๐', '๐', '๐คฉ', 'โค๏ธ']

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
