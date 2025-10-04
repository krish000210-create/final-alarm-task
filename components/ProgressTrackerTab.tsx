
import React, { useState, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import CalendarGrid from './CalendarGrid';

type Mark = 'check' | 'cross';

const ProgressTrackerTab: React.FC = () => {
    const [progressMarks, setProgressMarks] = useState<Record<string, Mark>>({});
    const [progressCalendarDate, setProgressCalendarDate] = useState(new Date());
    const [selectedMark, setSelectedMark] = useState<Mark>('check');

    const changeProgressMonth = (direction: number) => {
        setProgressCalendarDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + direction);
            return newDate;
        });
    };

    const markDay = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        setProgressMarks(prev => {
            const newMarks = { ...prev };
            if (newMarks[dateStr] === selectedMark) {
                delete newMarks[dateStr];
            } else {
                newMarks[dateStr] = selectedMark;
            }
            return newMarks;
        });
    };
    
    const renderProgressCalendarDay = useCallback((date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const mark = progressMarks[dateStr];

        if (mark === 'check') {
            return <CheckCircleIcon className="w-5 h-5 text-green-600 mt-1" />;
        }
        if (mark === 'cross') {
            return <XCircleIcon className="w-5 h-5 text-red-600 mt-1" />;
        }
        return null;
    }, [progressMarks]);


    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Progress Tracker</h2>
                <div className="flex items-center gap-4">
                    <button onClick={() => changeProgressMonth(-1)} className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                        <ChevronLeftIcon />
                    </button>
                    <span className="font-semibold min-w-[150px] text-center text-indigo-600">{progressCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => changeProgressMonth(1)} className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-600">Select a mark and click a day:</span>
                <button
                    onClick={() => setSelectedMark('check')}
                    className={`p-2 rounded-full border-2 transition-all ${selectedMark === 'check' ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-transparent'}`}
                >
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </button>
                <button
                    onClick={() => setSelectedMark('cross')}
                    className={`p-2 rounded-full border-2 transition-all ${selectedMark === 'cross' ? 'bg-red-100 border-red-500' : 'bg-gray-100 border-transparent'}`}
                >
                    <XCircleIcon className="w-6 h-6 text-red-600" />
                </button>
            </div>
            <CalendarGrid displayDate={progressCalendarDate} renderDayContent={renderProgressCalendarDay} onDayClick={markDay}/>
        </div>
    );
};

export default ProgressTrackerTab;
