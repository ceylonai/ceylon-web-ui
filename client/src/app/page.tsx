/*
 * Copyright 2024-Present, Syigen Ltd. and Syigen Private Limited. All rights reserved.
 */

"use client"

import ChatArea from "@/components/playground/chat-area"
import SettingsPanel from "@/components/playground/settings-panel"
import { useState } from "react"

export default function Layout() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(true)
    return (
        <div className="flex h-screen bg-black">
            <main className="flex-1 flex flex-col">
                <header className="p-4 border-b border-gray-800">
                    <div className="text-xl font-bold text-white">AI Chat</div>
                </header>
                <div className="flex-1 flex gap-4 p-4">
                    <ChatArea />
                    <SettingsPanel isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
                </div>
            </main>
        </div>
    )
}