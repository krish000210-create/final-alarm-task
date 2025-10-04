
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface PomodoroTimerTabProps {
  playAlarm: (description: string) => void;
}

type TimerMode = 'focus' | 'short' | 'long';

const timerModes: Record<TimerMode, number> = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
};

const PomodoroTimerTab: React.FC<PomodoroTimerTabProps> = ({ playAlarm }) => {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(timerModes.focus);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const stopTimer = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev > 1) {
                        return prev - 1;
                    }
                    stopTimer();
                    playAlarm(`Pomodoro ${mode} session complete!`);
                    return 0;
                });
            }, 1000);
        }
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, stopTimer, playAlarm, mode]);

    const changeMode = (newMode: TimerMode) => {
        stopTimer();
        setMode(newMode);
        setTimeLeft(timerModes[newMode]);
    };

    const toggleTimer = () => {
        setIsRunning(prev => !prev);
    };

    const resetTimer = () => {
        stopTimer();
        setTimeLeft(timerModes[mode]);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    
    const timerStatusText = isRunning 
        ? (mode === 'focus' ? 'Focus time!' : mode === 'short' ? 'Short break' : 'Long break') 
        : 'Ready to focus!';

    return (
        <div className="fade-in max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Pomodoro Timer</h2>
            <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => changeMode('focus')} className={`px-6 py-3 rounded-lg font-medium transition-colors ${mode === 'focus' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Focus<br /><small>(25m)</small></button>
                <button onClick={() => changeMode('short')} className={`px-6 py-3 rounded-lg font-medium transition-colors ${mode === 'short' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Short Break<br /><small>(5m)</small></button>
                <button onClick={() => changeMode('long')} className={`px-6 py-3 rounded-lg font-medium transition-colors ${mode === 'long' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Long Break<br /><small>(15m)</small></button>
            </div>
            <div className="relative w-80 h-80 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full"></div>
                <div className="absolute inset-4 bg-white rounded-full shadow-inner flex flex-col items-center justify-center">
                    <div className="text-6xl font-bold text-gray-900">{formatTime(timeLeft)}</div>
                    <div className="text-gray-600 mt-2">{timerStatusText}</div>
                </div>
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={toggleTimer} className={`px-8 py-3 text-white rounded-full font-bold transition-colors ${isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}>
                    {isRunning ? 'PAUSE' : 'START'}
                </button>
                <button onClick={resetTimer} className="px-8 py-3 bg-gray-300 text-gray-700 rounded-full font-bold hover:bg-gray-400 transition-colors">
                    RESET
                </button>
            </div>
        </div>
    );
};

export default PomodoroTimerTab;
