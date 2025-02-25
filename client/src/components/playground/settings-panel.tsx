"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {  UserCog } from "lucide-react"

export default function SettingsPanel({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (value: boolean) => void }) {
  const [humanInputAgents, setHumanInputAgents] = useState<{ id: string; name: string; status: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://localhost:8000/api/agents")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch agents")
        return res.json()
      })
      .then((data) => {
        const formattedAgents = data.map((agent: { id: string; name: string; status?: string }) => ({
          id: agent.id,
          name: agent.name,
          status: "online", 
        }))
        setHumanInputAgents(formattedAgents)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

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
          {loading ? (
            <p className="text-white">Loading agents...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <StatusSection
              icon={<UserCog className="w-5 h-5" />}
              title="Human Input Agents"
              onlineCount={humanInputAgents.filter((agent) => agent.status === "online").length}
              totalCount={humanInputAgents.length}
              items={humanInputAgents}
            />
          )}
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
  icon: React.ReactNode
  title: string
  onlineCount: number
  totalCount: number
  items: { id: string; name: string; status: string }[]
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
