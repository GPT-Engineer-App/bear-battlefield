import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Link } from "react-router-dom"

const Settings = () => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicVolume, setMusicVolume] = useState(50)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-500 p-4 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span>Sound Effects</span>
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Music Volume</span>
              <span>{musicVolume}%</span>
            </div>
            <Slider
              value={[musicVolume]}
              onValueChange={(value) => setMusicVolume(value[0])}
              max={100}
              step={1}
            />
          </div>
          <div className="pt-4">
            <Button asChild className="w-full">
              <Link to="/">Save and Return</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings