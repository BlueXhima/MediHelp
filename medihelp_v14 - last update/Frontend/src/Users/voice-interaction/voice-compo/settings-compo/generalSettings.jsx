import { useState } from "react";
import { Sun, Moon, Settings } from "lucide-react";

const GeneralSettings = () => {
    const [inputDevice, setInputDevice] = useState("Built-in Microphone");
    const [outputDevice, setOutputDevice] = useState("System Default");
    const [theme, setTheme] = useState("Light");
    const [notifications, setNotifications] = useState(true);
    const [voiceAlerts, setVoiceAlerts] = useState(false);

    return (
        <div className="space-y-6 text-left">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-semibold">General Settings</h2>
                <p className="text-gray-600">
                    Manage your basic preferences and hardware.
                </p>
            </div>

            {/* Language Selection */}
            <div className="bg-white p-4 border border-gray-100 rounded-xl shadow-sm">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Preferred Language</label>
                <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="en">English (Default)</option>
                    <option value="tl">Tagalog / Taglish</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-2 italic">Localizing responses helps in better understanding medical terms.</p>
            </div>

            {/* Audio Devices */}
            <div>
                <label className="block text-sm text-gray-700 font-medium mb-4">AUDIO DEVICES</label>
                <div className="grid grid-cols-2 gap-6">
                    {/* Input Device */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Input Device</span>
                        </div>
                        <select
                            value={inputDevice}
                            onChange={(e) => setInputDevice(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option>
                                Built-in Microphone (Android Pro)
                            </option>
                            <option>
                                External USB Mic
                            </option>
                            <option>
                                Bluetooth Headset Mic
                            </option>
                            <option>
                                Bluetooth Speaker
                            </option>
                        </select>
                    </div>

                    {/* Output Device */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Output Device</span>
                        </div>
                        <select
                            value={outputDevice}
                            onChange={(e) => setOutputDevice(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option>
                                System Default (Speakers)
                            </option>
                            <option>
                                Headphones
                            </option>
                            <option>
                                Bluetooth Speaker
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div>
                <label className="block text-sm text-gray-700 font-medium mb-4">APPEARANCE</label>
                <div className="grid grid-cols-3 gap-4">
                    {/* Light */}
                    <button
                        onClick={() => setTheme("Light")}
                        className={`flex flex-col items-center justify-center border rounded-md p-4 cursor-pointer ${
                            theme === "Light" ? "border-2 border-blue-500 bg-white" : "bg-gray-50"
                        }`}
                    >
                        <Sun className="text-yellow-500 mb-2" size={24} />
                        <span className="font-medium">Light</span>
                    </button>

                    {/* Dark */}
                    <button
                        onClick={() => setTheme("Dark")}
                        className={`flex flex-col items-center justify-center border rounded-md p-4 cursor-pointer ${
                            theme === "Dark" ? "border-2 border-blue-500 bg-white" : "bg-gray-50"
                        }`}
                    >
                        <Moon className="text-gray-700 mb-2" size={24} />
                        <span className="font-medium">Dark</span>
                    </button>

                    {/* System */}
                    <button
                        onClick={() => setTheme("System")}
                        className={`flex flex-col items-center justify-center border rounded-md p-4 cursor-pointer ${
                            theme === "System" ? "border-2 border-blue-500 bg-white" : "bg-gray-50"
                        }`}
                    >
                        <Settings className="text-gray-700 mb-2" size={24} />
                        <span className="font-medium">System</span>
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div>
                <label className="block text-sm text-gray-700 font-medium mb-4">NOTIFICATIONS</label>
                <div className="space-y-4">
                    <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                            <h4 className="font-medium">Sound Effects</h4>
                            <p className="text-sm text-gray-600">
                                Play gentle tones during interactions.
                            </p>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications ? "bg-blue-600" : "bg-gray-300"
                            }`}
                        >
                            <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications ? "translate-x-6" : "translate-x-1"
                            }`}
                            />
                        </button>
                    </div>
                    <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                            <h4 className="font-medium">Desktop Notifications</h4>
                            <p className="text-sm text-gray-600">
                                Receive notifications on your desktop.
                            </p>
                        </div>
                        <button
                            onClick={() => setVoiceAlerts(!voiceAlerts)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                voiceAlerts ? "bg-blue-600" : "bg-gray-300"
                            }`}
                        >
                            <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                voiceAlerts ? "translate-x-6" : "translate-x-1"
                            }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/80"
                >
                    Save Changes
                </button>
            </div>
        </div>
    )
}

export default GeneralSettings;