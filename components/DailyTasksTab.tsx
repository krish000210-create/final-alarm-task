
import React, { useState, useMemo, useCallback } from 'react';
import { Task } from '../types';
import { Trash2Icon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import CalendarGrid from './CalendarGrid';

const DailyTasksTab: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskText, setNewTaskText] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [taskCalendarDate, setTaskCalendarDate] = useState(new Date());

    const selectedDateString = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);

    const handleAddTask = () => {
        if (newTaskText.trim()) {
            setTasks(prev => [...prev, {
                id: Date.now(),
                text: newTaskText.trim(),
                date: selectedDateString,
                completed: false
            }]);
            setNewTaskText('');
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const changeTaskMonth = (direction: number) => {
        setTaskCalendarDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + direction);
            return newDate;
        });
    };

    const renderTaskCalendarDay = useCallback((date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayTasks = tasks.filter(t => t.date === dateStr);
        if (dayTasks.length > 0) {
            return (
                <div className="flex gap-1 mt-1">
                    {dayTasks.slice(0, 3).map((_, index) => (
                        <div key={index} className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                    ))}
                </div>
            );
        }
        return null;
    }, [tasks]);

    const tasksForSelectedDate = useMemo(() => tasks.filter(t => t.date === selectedDateString), [tasks, selectedDateString]);

    return (
        <div className="fade-in">
            <h2 className="text-2xl font-bold mb-4">
                Daily Tasks ({selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a new task"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                <input
                    type="date"
                    value={selectedDateString}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
                <button
                    onClick={handleAddTask}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                    Add Task
                </button>
            </div>

            <div className="flex flex-col gap-2 mb-8 min-h-[100px]">
                {tasksForSelectedDate.length > 0 ? (
                    tasksForSelectedDate.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className={`flex-1 text-gray-900 ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.text}</span>
                            <button onClick={() => deleteTask(task.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                <Trash2Icon />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">No tasks for this day.</div>
                )}
            </div>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Task Calendar</h3>
                    <div className="flex items-center gap-4">
                        <button onClick={() => changeTaskMonth(-1)} className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                            <ChevronLeftIcon />
                        </button>
                        <span className="font-semibold min-w-[150px] text-center text-indigo-600">{taskCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={() => changeTaskMonth(1)} className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>
                <CalendarGrid displayDate={taskCalendarDate} renderDayContent={renderTaskCalendarDay} />
            </div>
        </div>
    );
};

export default DailyTasksTab;
