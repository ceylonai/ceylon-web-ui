import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AgentFormData } from "@/types/agent"

interface AgentFormProps {
  formData: AgentFormData
  editingAgent: string | null
  onSubmit: (e: React.FormEvent) => void
  onChange: (data: Partial<AgentFormData>) => void
  onCancel: () => void
}

export function AgentForm({ formData, editingAgent, onSubmit, onChange, onCancel }: AgentFormProps) {
  const handleProfileIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          onChange({ profileIcon: reader.result.toString() })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" role="form">
      <div className="space-y-2">
        <Label htmlFor="name">Agent Name</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter agent name"
          className={cn("bg-background focus:ring-2 focus:ring-primary/50")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unitId">Unit ID</Label>
        <Input
          id="unitId"
          required
          value={formData.unitId}
          onChange={(e) => onChange({ unitId: e.target.value })}
          placeholder="Enter unit ID"
          className={cn("bg-background focus:ring-2 focus:ring-primary/50")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobRole">Job Role</Label>
        <Input
          id="jobRole"
          required
          value={formData.jobRole}
          onChange={(e) => onChange({ jobRole: e.target.value })}
          placeholder="Enter job role"
          className={cn("bg-background focus:ring-2 focus:ring-primary/50")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          required
          value={formData.instructions}
          onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder="Enter agent instructions"
          className={cn("min-h-[120px] bg-background focus:ring-2 focus:ring-primary/50")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileIcon">Profile Icon (Optional)</Label>
        <Input
          id="profileIcon"
          type="file"
          accept="image/*"
          onChange={handleProfileIconChange}
          className={cn("bg-background focus:ring-2 focus:ring-primary/50")}
        />
        {formData.profileIcon && (
          <Avatar>
            <AvatarImage src={formData.profileIcon} alt="Profile Preview" />
            <AvatarFallback>Preview</AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          className="flex-1 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          {editingAgent ? <Pencil className="h-5 w-5 mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
          {editingAgent ? "Update Agent" : "Register Agent"}
        </Button>
        {editingAgent && (
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

