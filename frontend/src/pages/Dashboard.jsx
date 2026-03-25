import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useToast } from '../components/Toast';
import { Plus, Trash2, Loader2, CheckCircle, Clock, Search, Filter, Activity, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });

  const fetchTasks = async () => {
    try {
      const response = await client.get('/tasks/');
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await client.post('/tasks/', newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '', status: 'pending' });
      addToast('Objective created successfully', 'success');
    } catch (err) {
      addToast('Failed to create objective', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (task, newStatus) => {
    try {
      const response = await client.put(`/tasks/${task.id}`, { ...task, status: newStatus });
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
      addToast(`Objective marked as ${newStatus.replace('_', ' ')}`, 'success');
    } catch (err) {
      addToast('Failed to update objective', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await client.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      addToast('Objective deleted', 'success');
    } catch (err) {
      addToast('Failed to delete objective', 'error');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-emerald-400" size={20} />;
      case 'in_progress': return <Activity className="text-indigo-400 animate-pulse" size={20} />;
      default: return <Clock className="text-slate-500" size={20} />;
    }
  };

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-6">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="font-semibold text-lg animate-pulse">Synchronizing assignments...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="text-indigo-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">Task Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">Assignment</span>
             <p className="text-slate-400 font-medium">Manage your daily tasks and objectives.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search objectives..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            className="sm:w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Objectives' },
              { value: 'pending', label: 'Pending' },
              { value: 'in_progress', label: 'Active' },
              { value: 'completed', label: 'Completed' }
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border-slate-800" hover={false}>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Objectives</p>
              <h3 className="text-2xl font-extrabold text-white">{stats.total}</h3>
          </Card>
          <Card className="p-4 border-slate-800" hover={false}>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">In Progress</p>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-extrabold text-indigo-400">{stats.active}</h3>
                <Activity size={18} className="text-indigo-500 animate-pulse" />
              </div>
          </Card>
          <Card className="p-4 border-slate-800" hover={false}>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Success Rate</p>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-extrabold text-emerald-400">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</h3>
                <CheckCircle size={18} className="text-emerald-500" />
              </div>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Task Creation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-slate-800 p-6 shadow-2xl !bg-slate-900/50" hover={false}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                <Plus size={18} className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">New Objective</h3>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-6">
              <Input
                label="Objective Title"
                placeholder="What needs to be done?"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Description</label>
                <textarea 
                  placeholder="Additional details..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-2.5 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all h-24 resize-none text-sm font-medium"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full py-3 font-bold" 
                icon={Plus}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Initialize Task'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Task List Main Area */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-20 text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-slate-700/50">
                  <Search size={36} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">No objectives found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your filters or add a new objective.</p>
              </motion.div>
            ) : (
              filteredTasks.map((task, index) => (
                <Card 
                  key={task.id} 
                  delay={index * 0.05}
                  className="group hover:border-indigo-500/30 !p-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-105 ${
                      task.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 
                      task.status === 'in_progress' ? 'bg-indigo-500/10 border-indigo-500/20 shadow-lg shadow-indigo-500/5' : 'bg-slate-800/50 border-slate-700/50'
                    }`}>
                      {getStatusIcon(task.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h4 className={`text-base font-bold truncate ${task.status === 'completed' ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-100 group-hover:text-indigo-400 transition-colors'}`}>
                          {task.title}
                        </h4>
                        {task.status === 'completed' && <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-500/20">Archived</span>}
                        {task.status === 'in_progress' && <span className="bg-indigo-500/10 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-indigo-500/20">Active</span>}
                      </div>
                      {task.description && (
                        <p className="text-slate-500 font-medium text-sm line-clamp-1 group-hover:text-slate-400 transition-colors">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto pt-4 sm:pt-0 sm:border-l sm:border-slate-800 sm:pl-6 shrink-0">
                      <Select
                        size="sm"
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task, e.target.value)}
                        className="!bg-slate-900/50 h-9"
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'in_progress', label: 'Active' },
                          { value: 'completed', label: 'Done' }
                        ]}
                      />
                      
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2.5 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20 shadow-none hover:shadow-lg hover:shadow-rose-500/5"
                        title="Delete Task"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
