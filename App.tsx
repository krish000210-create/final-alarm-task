
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { TabName } from './types';
import { CalendarIcon, CheckCircleIcon, ClockIcon, BellIcon, Volume2Icon, VolumeXIcon } from './components/icons';
import DailyTasksTab from './components/DailyTasksTab';
import ProgressTrackerTab from './components/ProgressTrackerTab';
import PomodoroTimerTab from './components/PomodoroTimerTab';
import AlarmsTab from './components/AlarmsTab';

const AmbientSoundPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
        setIsPlaying(!isPlaying);
    };
    
    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3; // Set a pleasant volume
      }
    }, []);

    return (
        <div>
            <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808f572f3.mp3" loop />
            <button
                onClick={togglePlay}
                className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                aria-label={isPlaying ? "Pause ambient sound" : "Play ambient sound"}
            >
                {isPlaying ? <Volume2Icon /> : <VolumeXIcon />}
            </button>
        </div>
    );
};

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabName>('daily');
    const [ringingAlarmDescription, setRingingAlarmDescription] = useState<string | null>(null);
    const alarmAudioRef = useRef<HTMLAudioElement>(null);

    const playAlarm = useCallback((description: string) => {
        setRingingAlarmDescription(description);
        if (alarmAudioRef.current) {
            alarmAudioRef.current.currentTime = 0;
            alarmAudioRef.current.play().catch(e => console.error("Alarm audio play failed:", e));
        }
    }, []);

    const stopAlarm = () => {
        if (alarmAudioRef.current) {
            alarmAudioRef.current.pause();
            alarmAudioRef.current.currentTime = 0;
        }
        setRingingAlarmDescription(null);
    };
    
    const tabs: { id: TabName; label: string; icon: React.ReactNode }[] = [
        { id: 'daily', label: 'Daily Tasks', icon: <CalendarIcon /> },
        { id: 'progress', label: 'Progress Tracker', icon: <CheckCircleIcon /> },
        { id: 'pomodoro', label: 'Pomodoro Timer', icon: <ClockIcon /> },
        { id: 'alarms', label: 'Alarms', icon: <BellIcon /> },
    ];
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 sm:p-8 text-white flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Student Prep Dashboard</h1>
                            <p className="text-indigo-200">Organize your study time effectively</p>
                        </div>
                        <AmbientSoundPlayer />
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
                        {tabs.map(tab => (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                                    activeTab === tab.id
                                        ? 'bg-white text-indigo-600 shadow-md'
                                        : 'text-gray-600 hover:bg-gray-200/50'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-8">
                        {activeTab === 'daily' && <DailyTasksTab />}
                        {activeTab === 'progress' && <ProgressTrackerTab />}
                        {activeTab === 'pomodoro' && <PomodoroTimerTab playAlarm={playAlarm} />}
                        {activeTab === 'alarms' && <AlarmsTab playAlarm={playAlarm} />}
                    </div>
                </div>
            </div>

            {/* Alarm Modal */}
            {ringingAlarmDescription && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-8 shadow-xl text-center fade-in">
                        <BellIcon className="w-16 h-16 text-indigo-500 mx-auto mb-4 animate-bounce" />
                        <h2 className="text-2xl font-bold mb-2">Alarm!</h2>
                        <p className="text-gray-700 mb-6">{ringingAlarmDescription}</p>
                        <button
                            onClick={stopAlarm}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
            <audio ref={alarmAudioRef} src="https://www.soundjay.com/clock/sounds/alarm-clock-01.mp3" loop />
        </div>
    );
};

export default App;
