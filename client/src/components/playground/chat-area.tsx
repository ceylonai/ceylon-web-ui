/*
 * Copyright 2024-Present, Syigen Ltd. and Syigen Private Limited. All rights reserved.
 */

"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { io, type Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Loader2 } from "lucide-react"

interface Message {
    username: string
    message: string
    timestamp: number
}

const ChatArea: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState("")
    const [username, setUsername] = useState("")
    const [count,setCount] = useState(0)
    const [connectionStatus, setConnectionStatus] = useState("Connecting...")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const newSocket = io("http://localhost:8000", {
            transports: ["websocket", "polling"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
            withCredentials: true,
            forceNew: true,
        });

        newSocket.on("connect", () => {
            console.log("Connected to server");
            setConnectionStatus("✅ Connected");
            let enteredUsername = window.prompt("Enter your username:", "");

            if (!enteredUsername || enteredUsername.trim() === "") {
                enteredUsername = `User${Math.floor(Math.random() * 1000)}`;
            }

            setUsername(enteredUsername);
            newSocket.emit("set_username", enteredUsername);
        });


        newSocket.on("connect_error", (error) => {
            console.error("Connection error:", error);
            setConnectionStatus("⚠️ Connection failed. Retrying...");
        });

        newSocket.on("disconnect", (reason) => {
            console.log("Disconnected:", reason);
            setConnectionStatus("🔄 Reconnecting...");
        });

        newSocket.on("response", (data: Message) => {
            if (typeof data.message === "string") {
                setMessages((prev) => [...prev, { ...data, timestamp: Date.now() }]);
            } else {
                console.error("Invalid message format:", data);
            }
        });

        // Listen for user count updates
        newSocket.on("users_count", (data: { count: number }) => {
            setCount(data.count);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messagesEndRef]) //Corrected dependency

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (socket && inputMessage.trim()) {
            socket.emit("message", inputMessage.trim())
            setInputMessage("")
        }
    }

    return (
        <div className=" rounded-lg flex flex-1 flex-col h-full bg-gray-800">
            {/* System Message */}
            <div className="bg-gray-900 p-4 text-gray-400 flex justify-between items-center rounded-lg">
                <div className="flex items-center justify-between mb-1">
                    <div className="text-gray-400 flex items-center space-x-2">
                        <span>Active Users -</span>
                        <span className="font-semibold text-white">{count}</span>
                    </div>

                    <div className="text-gray-400">{connectionStatus}</div>
                </div>
                <div className="text-gray-300">{username ? `Connected as ${username}` : "Connecting..."}</div>
            </div>


            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 max-h-[calc(100vh-220px)]">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg max-w-[80%] ${msg.username === username ? "bg-[#2D1B69] ml-auto" : "bg-gray-700"}`}
                    >
                        <div className="text-sm font-semibold text-gray-300">{msg.username}</div>
                        <div className="text-white break-words">{msg.message}</div>
                    </div>
                ))}
                <div ref={messagesEndRef}/>
            </div>


            {/* Message Input */}
            <div>
            <form onSubmit={handleSubmit} className="bg-gray-900 p-4 flex gap-2 rounded-lg">
                    <Button type="button" variant="ghost" size="icon" >
                        <Paperclip className="w-5 h-5 text-white  border-white-800"/>
                    </Button>
                    <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-gray-800 text-white"
                        disabled={!socket?.connected}
                    />
                    <Button type="submit" disabled={!socket?.connected || !inputMessage.trim()}>
                        {socket?.connected ? "Send" : <Loader2 className="w-5 h-5 animate-spin"/>}
                    </Button>
            </form>
            </div>
        </div>
    )
}
export default ChatArea;