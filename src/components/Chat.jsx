import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

function Chat() {
  const { targetUserId } = useParams();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [targetUserName, setTargetUserName] = useState("Loading...");

  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const socketRef = useRef(null);

  const fetchChatMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      // Extract the other user's name from participants
      const otherUser = res.data?.participants?.find((p) => p._id !== userId);
      if (otherUser) {
        setTargetUserName(`${otherUser.firstName} ${otherUser.lastName}`);
      }

      const historicalMessages = res.data?.messages?.map((msg) => ({
        firstName: msg.sender?.firstName || "User",
        text: msg.content,
        senderId: msg.sender?._id || msg.sender,
      })) || [];

      setMessages(historicalMessages);
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  useEffect(() => {
    if (!userId || !targetUserId) return;

    fetchChatMessages();

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, text, senderId }) => {
      setMessages((prev) => [...prev, { firstName, text, senderId }]);
    });

    return () => {
      socket.off("messageReceived");
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      senderId: userId,
      targetUserId,
      text: inputText,
    });

    setInputText("");
  };

  if (!user) return <div className="text-white p-10 text-center">Loading...</div>;

  return (
    <div className="flex flex-col h-[70vh] w-full max-w-2xl mx-auto bg-[#16181f] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden mt-10">
      <div className="bg-[#232530] p-4 border-b border-gray-700">
        <h2 className="text-white font-bold flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          Chatting with: <span className="text-blue-400 font-medium">{targetUserName}</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f1015]">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-2xl max-w-[80%] ${
                msg.senderId === userId
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none shadow-lg"
                  : "bg-[#232530] text-gray-200 rounded-tl-none border border-gray-700"
              }`}>
              <p className="text-[10px] opacity-50 mb-1 uppercase font-bold">{msg.firstName}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-[#232530] border-t border-gray-700">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#0f1015] text-white border border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-colors">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;