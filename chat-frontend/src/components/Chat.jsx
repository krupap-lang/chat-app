// import React, { useEffect, useState, useRef } from 'react';
// import { socket } from '../socket';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Chat = () => {
//   const [users, setUsers] = useState([]);
//   const [myGroups, setMyGroups] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [selectedUsers, setSelectedUsers] = useState([]);

//   const [groupMembers, setGroupMembers] = useState([]);

//   const navigate = useNavigate();
//   const myId = localStorage.getItem('userId');
//   const myName = localStorage.getItem('userName');
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (!socket.connected) {
//       socket.auth = { token: localStorage.getItem('token') };
//       socket.connect();
//     }

//     // Load users
//     axios.get('http://localhost:3000/auth/users').then(res => setUsers(res.data));
    
//     // Load groups for current user from DB
//     axios.get(`http://localhost:3000/groups/user/${myId}`).then(res => setMyGroups(res.data));

//     socket.on('receiveMessage', (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => socket.off('receiveMessage');
//   }, [myId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleLogout = () => {
//     socket.disconnect();
//     localStorage.clear();
//     navigate('/login');
//     window.location.reload(); 
//   };

//   const loadChat = async (roomId, chatInfo) => {
//   setSelectedChat(chatInfo);
//   setMessages([]);
//   setGroupMembers([]); // Reset members list
//   socket.emit('joinRoom', roomId);

//   try {
//     // Fetch History
//     const history = await axios.get(`http://localhost:3000/messages/${roomId}`);
//     setMessages(history.data);

//     // If it's a group, fetch the member names
//     if (chatInfo.isGroup) {
//       const members = await axios.get(`http://localhost:3000/groups/${roomId}/members`);
//       setGroupMembers(members.data);
//     }
//   } catch (err) {
//     console.error("Error loading chat data", err);
//   }
// };

//   const joinPrivateChat = (user) => {
//     const roomId = [myId, user._id].sort().join('_');
//     loadChat(roomId, { ...user, isGroup: false });
//   };

//   const joinGroupChat = (group) => {
//     loadChat(group.roomId, { ...group, isGroup: true });
//   };

//   const handleCreateGroup = async () => {
//     if (!newGroupName || selectedUsers.length === 0) return alert("Enter a group name and select members!");

//     const payload = {
//       name: newGroupName,
//       members: [...selectedUsers, myId] 
//     };

//     try {
//       const { data } = await axios.post('http://localhost:3000/groups/create', payload);
//       setMyGroups((prev) => [...prev, data]);
//       setIsModalOpen(false);
//       setNewGroupName('');
//       setSelectedUsers([]);
//       joinGroupChat(data);
//     } catch (err) {
//       alert("Error creating group in database");
//     }
//   };

//   const toggleUserSelection = (userId) => {
//     setSelectedUsers(prev => 
//       prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
//     );
//   };

//   const handleSend = () => {
//     if (!message || !selectedChat) return;
//     const roomId = selectedChat.isGroup ? selectedChat.roomId : [myId, selectedChat._id].sort().join('_');
//     socket.emit('sendMessage', { roomId, content: message });
//     setMessage('');
//   };

//   return (




//     <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f2f5' }}>
//       {/* Sidebar */}
//       <div style={{ width: '300px', backgroundColor: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
//         <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <strong>{myName}</strong>
//           <button onClick={handleLogout} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Logout</button>
//         </div>

//         <div style={{ padding: '10px 20px' }}>
//             <button onClick={() => setIsModalOpen(true)} style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
//                 + Create Group
//             </button>
//         </div>

//         <div style={{ flex: 1, overflowY: 'auto' }}>
//           <p style={{ padding: '0 20px', fontSize: '12px', color: '#888', fontWeight: 'bold' }}>GROUPS</p>
//           {myGroups.map(group => (
//             <div key={group._id} onClick={() => joinGroupChat(group)} style={{ padding: '15px', cursor: 'pointer', background: selectedChat?.roomId === group.roomId ? '#e7f3ff' : 'transparent', borderBottom: '1px solid #f9f9f9' }}>
//               # {group.name}
//             </div>
//           ))}

//           <p style={{ padding: '10px 20px 0', fontSize: '12px', color: '#888', fontWeight: 'bold' }}>DIRECT MESSAGES</p>
//           {users.filter(u => u._id !== myId).map(user => (
//             <div key={user._id} onClick={() => joinPrivateChat(user)} style={{ padding: '15px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9', background: selectedChat?._id === user._id ? '#e7f3ff' : 'transparent' }}>
//               {user.name}
//             </div>
//           ))}
//         </div>
//       </div>


//       {/* Main Chat Interface */}
// <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//   {selectedChat ? (
//     <>
//       {/* HEADER SECTION UPDATED */}
//       <div style={{ padding: '15px', background: '#fff', borderBottom: '1px solid #ddd' }}>
//         <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
//           {selectedChat.isGroup ? `Group: ${selectedChat.name}` : selectedChat.name}
//         </div>
        
//         {/* NEW: Display Group Members names */}
//         {selectedChat.isGroup && (
//           <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
//             <span style={{ fontWeight: '600' }}>Members: </span>
//             {groupMembers.length > 0 
//               ? groupMembers.map((m) => m.name).join(', ') 
//               : 'Loading members...'}
//           </div>
//         )}
//       </div>

//       <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
//         {messages.map((m, i) => {
//           const isMe = m.senderId === myId;
//           return (
//             <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', marginBottom: '10px', maxWidth: '70%' }}>
//               {!isMe && selectedChat.isGroup && (
//                 <small style={{ display: 'block', color: '#888', marginBottom: '2px' }}>
//                   {m.senderName}
//                 </small>
//               )}
//               <div style={{ 
//                 background: isMe ? '#007bff' : '#fff', 
//                 color: isMe ? '#fff' : '#000', 
//                 padding: '10px', 
//                 borderRadius: '10px', 
//                 boxShadow: '0 1px 2px rgba(0,0,0,0.1)' 
//               }}>
//                 {m.content}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #ddd', display: 'flex' }}>
//         <input 
//           value={message} 
//           onChange={e => setMessage(e.target.value)} 
//           onKeyPress={e => e.key === 'Enter' && handleSend()} 
//           placeholder="Type a message..." 
//           style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd', outline: 'none' }} 
//         />
//         <button 
//           onClick={handleSend} 
//           style={{ marginLeft: '10px', padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//         >
//           Send
//         </button>
//       </div>
//     </>
//   ) : (
//     <div style={{ margin: 'auto', color: '#888' }}>Select a chat or create a group to start</div>
//   )}
// </div>

//       {/* Modal remains the same */}
//       {isModalOpen && (
//         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
//           <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '350px' }}>
//             <h3>Create Group</h3>
//             <input placeholder="Group Name" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', boxSizing: 'border-box' }} />
//             <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
//               {users.filter(u => u._id !== myId).map(user => (
//                 <div key={user._id} style={{ marginBottom: '5px' }}>
//                   <label>
//                     <input type="checkbox" checked={selectedUsers.includes(user._id)} onChange={() => toggleUserSelection(user._id)} /> {user.name}
//                   </label>
//                 </div>
//               ))}
//             </div>
//             <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
//               <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 15px', background: '#ccc', border: 'none', borderRadius: '4px' }}>Cancel</button>
//               <button onClick={handleCreateGroup} style={{ padding: '8px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Create</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chat;

import React, { useEffect, useState, useRef } from 'react';
import { socket } from '../socket';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// NEW: GraphQL Imports
import { useMutation, useSubscription, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";


// NEW: GraphQL Definitions
const TYPING_SUBSCRIPTION = gql`
  subscription OnUserTyping($roomId: String!) {
    userTyping(roomId: $roomId) {
      username
      isTyping
    }
  }
`;

const SET_TYPING_MUTATION = gql`
  mutation SetTyping($roomId: String!, $username: String!, $isTyping: Boolean!) {
    setTypingStatus(roomId: $roomId, username: $username, isTyping: $isTyping)
  }
`;

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  // NEW: Typing Indicator States
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const myId = localStorage.getItem('userId');
  const myName = localStorage.getItem('userName');
  const messagesEndRef = useRef(null);

  // Determine current Room ID helper
  const getCurrentRoomId = () => {
    if (!selectedChat) return null;
    return selectedChat.isGroup ? selectedChat.roomId : [myId, selectedChat._id].sort().join('_');
  };

  // NEW: GraphQL Mutation & Subscription
  const [setTyping] = useMutation(SET_TYPING_MUTATION);
  const { data: typingData } = useSubscription(TYPING_SUBSCRIPTION, {
    variables: { roomId: getCurrentRoomId() },
    skip: !selectedChat,
  });

  // NEW: Effect to listen for typing events
  useEffect(() => {
    if (typingData?.userTyping) {
      const { username, isTyping } = typingData.userTyping;
      // Only show if it's NOT me typing
      if (username !== myName) {
        setTypingUser(isTyping ? username : null);
      }
    }
  }, [typingData, myName]);

  useEffect(() => {
    if (!socket.connected) {
      socket.auth = { token: localStorage.getItem('token') };
      socket.connect();
    }
    axios.get('http://localhost:3000/auth/users').then(res => setUsers(res.data));
    axios.get(`http://localhost:3000/groups/user/${myId}`).then(res => setMyGroups(res.data));

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('receiveMessage');
  }, [myId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // NEW: Modified Input Handler to trigger Typing events
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    const roomId = getCurrentRoomId();
    if (!roomId) return;

    // Send "isTyping: true" to GraphQL
    setTyping({ variables: { roomId, username: myName, isTyping: true } });

    // Clear previous timeout and set a new one to stop the indicator after 2 seconds
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping({ variables: { roomId, username: myName, isTyping: false } });
    }, 2000);
  };

  const handleLogout = () => {
    socket.disconnect();
    localStorage.clear();
    navigate('/login');
    window.location.reload(); 
  };

  const loadChat = async (roomId, chatInfo) => {
    setSelectedChat(chatInfo);
    setMessages([]);
    setGroupMembers([]);
    setTypingUser(null); // Reset typing status on chat change
    socket.emit('joinRoom', roomId);
    try {
      const history = await axios.get(`http://localhost:3000/messages/${roomId}`);
      setMessages(history.data);
      if (chatInfo.isGroup) {
        const members = await axios.get(`http://localhost:3000/groups/${roomId}/members`);
        setGroupMembers(members.data);
      }
    } catch (err) {
      console.error("Error loading chat data", err);
    }
  };

  const joinPrivateChat = (user) => {
    const roomId = [myId, user._id].sort().join('_');
    loadChat(roomId, { ...user, isGroup: false });
  };

  const joinGroupChat = (group) => {
    loadChat(group.roomId, { ...group, isGroup: true });
  };

  const handleCreateGroup = async () => {
    if (!newGroupName || selectedUsers.length === 0) return alert("Enter a group name and select members!");
    const payload = { name: newGroupName, members: [...selectedUsers, myId] };
    try {
      const { data } = await axios.post('http://localhost:3000/groups/create', payload);
      setMyGroups((prev) => [...prev, data]);
      setIsModalOpen(false);
      setNewGroupName('');
      setSelectedUsers([]);
      joinGroupChat(data);
    } catch (err) {
      alert("Error creating group");
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleSend = () => {
    if (!message || !selectedChat) return;
    const roomId = getCurrentRoomId();
    socket.emit('sendMessage', { roomId, content: message });
    
    // Explicitly stop typing when message is sent
    setTyping({ variables: { roomId, username: myName, isTyping: false } });
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Sidebar (Same as before) */}
      <div style={{ width: '300px', backgroundColor: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>{myName}</strong>
          <button onClick={handleLogout} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
        <div style={{ padding: '10px 20px' }}>
            <button onClick={() => setIsModalOpen(true)} style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                + Create Group
            </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <p style={{ padding: '0 20px', fontSize: '12px', color: '#888', fontWeight: 'bold' }}>GROUPS</p>
          {myGroups.map(group => (
            <div key={group._id} onClick={() => joinGroupChat(group)} style={{ padding: '15px', cursor: 'pointer', background: selectedChat?.roomId === group.roomId ? '#e7f3ff' : 'transparent', borderBottom: '1px solid #f9f9f9' }}>
              # {group.name}
            </div>
          ))}
          <p style={{ padding: '10px 20px 0', fontSize: '12px', color: '#888', fontWeight: 'bold' }}>DIRECT MESSAGES</p>
          {users.filter(u => u._id !== myId).map(user => (
            <div key={user._id} onClick={() => joinPrivateChat(user)} style={{ padding: '15px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9', background: selectedChat?._id === user._id ? '#e7f3ff' : 'transparent' }}>
              {user.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            <div style={{ padding: '15px', background: '#fff', borderBottom: '1px solid #ddd' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {selectedChat.isGroup ? `Group: ${selectedChat.name}` : selectedChat.name}
              </div>
              {selectedChat.isGroup && (
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  <span style={{ fontWeight: '600' }}>Members: </span>
                  {groupMembers.length > 0 ? groupMembers.map((m) => m.name).join(', ') : 'Loading members...'}
                </div>
              )}
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {messages.map((m, i) => {
                const isMe = m.senderId === myId;
                return (
                  <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', marginBottom: '10px', maxWidth: '70%' }}>
                    {!isMe && selectedChat.isGroup && <small style={{ display: 'block', color: '#888', marginBottom: '2px' }}>{m.senderName}</small>}
                    <div style={{ background: isMe ? '#007bff' : '#fff', color: isMe ? '#fff' : '#000', padding: '10px', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                      {m.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* NEW: Typing Indicator Container */}
            <div style={{ padding: '0 20px', height: '20px' }}>
               {typingUser && <small style={{ color: '#888', fontStyle: 'italic' }}>{typingUser} is typing...</small>}
            </div>

            <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #ddd', display: 'flex' }}>
              <input 
                value={message} 
                onChange={handleInputChange} 
                onKeyPress={e => e.key === 'Enter' && handleSend()} 
                placeholder="Type a message..." 
                style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd', outline: 'none' }} 
              />
              <button onClick={handleSend} style={{ marginLeft: '10px', padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Send</button>
            </div>
          </>
        ) : <div style={{ margin: 'auto', color: '#888' }}>Select a chat or create a group to start</div>}
      </div>

      {/* Modal (Same as before) */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '350px' }}>
            <h3>Create Group</h3>
            <input placeholder="Group Name" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', boxSizing: 'border-box' }} />
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {users.filter(u => u._id !== myId).map(user => (
                <div key={user._id} style={{ marginBottom: '5px' }}>
                  <label>
                    <input type="checkbox" checked={selectedUsers.includes(user._id)} onChange={() => toggleUserSelection(user._id)} /> {user.name}
                  </label>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 15px', background: '#ccc', border: 'none', borderRadius: '4px' }}>Cancel</button>
              <button onClick={handleCreateGroup} style={{ padding: '8px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;