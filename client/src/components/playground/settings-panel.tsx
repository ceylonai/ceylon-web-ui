import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPanel({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (value: boolean) => void }) {
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
                    {["Model", "Temperature", "Max Length", "Top P"].map((label, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-400">{label}</div>
                                <div className="text-xs text-gray-500">{i === 0 ? "gpt-40" : ""}</div>
                            </div>
                            {i === 0 ? (
                                <Select defaultValue="gpt-4">
                                    <SelectTrigger className="w-full bg-transparent border-gray-800">
                                        <SelectValue placeholder="Select model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                                        <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                                        <SelectItem value="claude">Claude</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Slider
                                    defaultValue={[i === 1 ? 0.7 : i === 2 ? 50 : 0.9]}
                                    max={i === 2 ? 100 : 1}
                                    step={i === 2 ? 1 : 0.1}
                                    className="w-full"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
