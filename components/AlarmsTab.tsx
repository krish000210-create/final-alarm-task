
import React, { useState, useEffect, useRef } from 'react';
import { Alarm } from '../types';
import { Trash2Icon } from './icons';

interface AlarmsTabProps {
  playAlarm: (description: string) => void;
}

const AlarmsTab: React.FC<AlarmsTabProps> = ({ playAlarm }) => {
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [newAlarmDesc, setNewAlarmDesc] = useState('');
    const [newAlarmTime, setNewAlarmTime] = useState('09:00');
    const [newAlarmRepeat, setNewAlarmRepeat] = useState(false);
    
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        intervalRef.current = window.setInterval(() => {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            alarms.forEach(alarm => {
                if (alarm.time === currentTime) {
                    playAlarm(alarm.description);
                    if (!alarm.repeat) {
                        // For one-time alarms, we can remove them after they ring
                        setAlarms(prev => prev.filter(a => a.id !== alarm.id));
                    }
                }
            });
        }, 1000 * 30); // Check every 30 seconds

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [alarms, playAlarm]);

    const addAlarm = () => {
        if (newAlarmDesc.trim() && newAlarmTime) {
            setAlarms(prev => [...prev, {
                id: Date.now(),
                description: newAlarmDesc.trim(),
                time: newAlarmTime,
                repeat: newAlarmRepeat
            }].sort((a,b) => a.time.localeCompare(b.time)));
            setNewAlarmDesc('');
        }
    };
    
    const deleteAlarm = (id: number) => {
        setAlarms(alarms.filter(a => a.id !== id));
    };

    return (
        <div className="fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Set a New Alarm</h2>
                    <div className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow">
                        <input
                            type="text"
                            value={newAlarmDesc}
                            onChange={e => setNewAlarmDesc(e.target.value)}
                            placeholder="Task Description"
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        />
                        <div className="flex items-center gap-4">
                            <input
                                type="time"
                                value={newAlarmTime}
                                onChange={e => setNewAlarmTime(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                            />
                            <label className="flex items-center gap-2 text-gray-700 text-sm">
                                <input type="checkbox" checked={newAlarmRepeat} onChange={e => setNewAlarmRepeat(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                Repeat Daily
                            </label>
                        </div>
                        <button
                            onClick={addAlarm}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Set Alarm
                        </button>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Upcoming Alarms</h2>
                    <div className="flex flex-col gap-3 min-h-[200px]">
                        {alarms.length > 0 ? alarms.map(alarm => (
                             <div key={alarm.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-start">
                                <div>
                                    <div className="text-xl font-bold text-gray-900">{alarm.time}</div>
                                    <div className="text-gray-600">{alarm.description}</div>
                                    <div className="text-xs text-gray-400">{alarm.repeat ? 'Daily' : 'One Time'}</div>
                                </div>
                                <button onClick={() => deleteAlarm(alarm.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors">
                                    <Trash2Icon />
                                </button>
                            </div>
                        )) : <div className="text-center text-gray-500 py-10">No alarms set.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlarmsTab;
