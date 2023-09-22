import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {io} from 'socket.io-client';
const socket = io('http://localhost:3001');
import './App.css'


function App() {
	const [count, setCount] = useState(0)
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [messages, setMessages] = useState([])
	const [users, setUsers] = useState([])

	const onFooEvent = (value) => {
		socket.emit('foo', value)
	}

	const displayChatRoomUsers = (data) => {
		setUsers(data)
	}

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}


		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('chatroom_users', displayChatRoomUsers)
		socket.on('receive_message', (msg) => {
			setMessages((prev) => {
				return [...prev, msg]
			})
		})

		return () => {
			socket.off('connect', onConnect);
			socket.off('receive_message', () => {console.log("See you next time")})
			socket.off('disconnect', onDisconnect);
		};
	}, [])
	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<p>{isConnected && "Connected to Socket"}</p>
			<div className='flex'>
				<ul>
					{!!messages && messages.map((msg, idx) => {
						return <li key={idx}>{JSON.stringify(msg)}</li>
					})}
				</ul>
				<ul>
					{!!users && users.map((user, idx) => {
						return <li key={idx}>{JSON.stringify(user)}</li>
					})}
				</ul></div>
			<div className="card">
				<div>

					<button onClick={() => {
						setCount((count) => count + 1)
						onFooEvent({fart: "Nice and Smelly"})
					}}>
						count is {count}
					</button>
					<button type="button" onClick={() => {
						socket.emit('join_room', {username: 'foy4748', roomName: 'React'})
					}}>
						Join Room
					</button>
				</div>
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>

		</>
	)
}

export default App
