// src/pages/StudyPlanner.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudyPlanner() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('omnipdf_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('omnipdf_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-800 font-medium text-sm mb-4">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>
      <h1 className="text-3xl font-bold text-slate-800">Study Planner & Tasks</h1>
      <p className="text-slate-500 mt-1 mb-6">Organize your reading assignments, research notes, and document review goals.</p>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <form onSubmit={addTask} className="flex gap-3">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Add a new study task or PDF reading goal..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm"
          />
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-1">
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </form>

        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No tasks added yet. Plan your study session above!</div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => toggleTask(task.id)}>
                  <CheckCircle2 className={`w-5 h-5 ${task.completed ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'}`} />
                  <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.text}</span>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}