import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface CalendarGridProps {
  displayDate: Date;
  renderDayContent: (date: Date) => React.ReactNode;
  onDayClick?: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ displayDate, renderDayContent, onDayClick }) => {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to compare just the date part

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
    <div key={day} className="text-center font-semibold text-indigo-500 p-2 text-sm">{day}</div>
  ));

  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`} className="h-16"></div>);
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    
    // For comparison, create a date with time set to 0
    const comparisonDate = new Date(year, month, day);
    comparisonDate.setHours(0, 0, 0, 0);
    const isToday = comparisonDate.getTime() === today.getTime();
    
    return (
      <div
        key={dateStr}
        className={`h-16 border border-gray-200 rounded-lg flex flex-col items-center justify-center transition-all ${onDayClick ? 'cursor-pointer hover:bg-gray-100' : ''}`}
        onClick={() => onDayClick && onDayClick(date)}
      >
        <span className={`text-sm font-medium ${isToday ? 'bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-800'}`}>{day}</span>
        {renderDayContent(date)}
      </div>
    );
  });

  return (
    <div className="grid grid-cols-7 gap-1">
      {dayHeaders}
      {blanks}
      {days}
    </div>
  );
};

export default CalendarGrid;