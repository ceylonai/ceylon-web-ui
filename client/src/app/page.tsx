/*
 * Copyright 2024-Present, Syigen Ltd. and Syigen Private Limited. All rights reserved.
 */

"use client"

import ChatArea from "@/components/playground/chat-area"
import SettingsPanel from "@/components/playground/settings-panel"
import { useState } from "react"
import { Plus } from "lucide-react";

export default function Layout() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(true)
    return (
        <div className="flex h-screen bg-black overflow-hidden">
            <main className="flex-1 flex flex-col">
                    <header className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <div className="text-xl font-bold text-white">AI Chat</div>
                        <button className="flex items-center gap-2 hover:bg-blue-600 bg-indigo-900 text-white font-bold py-2 px-4 rounded-lg transition mr-4">
                            <Plus size={20} />
                            Agent
                        </button>

                    </header>

                <div className="flex-1 flex gap-4 p-4">
                    <ChatArea />
                    <SettingsPanel isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
                </div>
            </main>
        </div>
    )
}