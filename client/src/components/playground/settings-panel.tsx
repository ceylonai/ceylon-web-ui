/*
 * Copyright 2024-Present, Syigen Ltd. and Syigen Private Limited. All rights reserved.
 */

"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {  User, UserCog, Users } from "lucide-react"

// Mock data for workers and human input agents
const workers = [
  { id: 1, name: "Worker 1", status: "online" },
  { id: 2, name: "Worker 2", status: "offline" },
  { id: 3, name: "Worker 3", status: "online" },
]

const humanInputAgents = [
  { id: 1, name: "Agent 1", status: "online" },
  { id: 2, name: "Agent 2", status: "offline" },
]

const activeUsers = [
  { id: 1, name: "User 1", status: "online" },
  { id: 2, name: "User 2", status: "offline" },
  { id: 3, name: "User 3", status: "online" },
]

export default function SettingsPanel({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (value: boolean) => void }) {
  // Count online workers and agents
  const onlineUsers = activeUsers.filter((user) => user.status === "online").length
  const onlineWorkers = workers.filter((worker) => worker.status === "online").length
  const onlineAgents = humanInputAgents.filter((agent) => agent.status === "online").length

  return (
    <>
      {/* Settings Toggle Button */}
      <Button
                variant="ghost"
                size="icon"
                className="h-auto py-2 px-1 hover:bg-gray-800"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="grid grid-cols-2 gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-gray-400" />
                    ))}
                </div>
            </Button>
      {/* Settings Panel */}
      <div
        className={cn(
          "w-80 bg-gray-900 rounded-lg transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full w-0 p-0",
        )}
      >
        <div className="space-y-6 p-4">
          <StatusSection
            icon={<User className="w-5 h-5" />}
            title="Active Users"
            onlineCount={onlineUsers}
            totalCount={activeUsers.length}
            items={activeUsers}
          />

          <StatusSection
            icon={<Users className="w-5 h-5" />}
            title="Workers"
            onlineCount={onlineWorkers}
            totalCount={workers.length}
            items={workers}
          />

          <StatusSection
            icon={<UserCog className="w-5 h-5" />}
            title="Human Input Agents"
            onlineCount={onlineAgents}
            totalCount={humanInputAgents.length}
            items={humanInputAgents}
          />
        </div>
      </div>
    </>
  )
}

function StatusSection({
  icon,
  title,
  onlineCount,
  totalCount,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  onlineCount: number;
  totalCount: number;
  items: { id: number; name: string; status: string }[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-gray-400">
        {icon}
        <div className="text-sm">
          {title} ({onlineCount} / {totalCount} online)
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <div className={cn("w-3 h-3 rounded-full", item.status === "online" ? "bg-green-400" : "bg-gray-500")} />
            <span className={cn("text-xs", item.status === "online" ? "text-white" : "text-gray-400")}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}