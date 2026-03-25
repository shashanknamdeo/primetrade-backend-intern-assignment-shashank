import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Shield, Mail, Calendar, User, Search, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await client.get('/users/');
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch user list. Are you an admin?');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-6">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-semibold text-lg animate-pulse">Accessing Secure Registry...</p>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center py-20 px-4">
            <Card className="max-w-md w-full p-8 text-center border-rose-500/20" hover={false}>
                <div className="bg-rose-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-rose-500 mb-6 border border-rose-500/20">
                    <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{error}</h3>
                <p className="text-slate-500 font-medium text-sm">This secure workspace is restricted to administrator accounts only.</p>
            </Card>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-indigo-400" size={28} />
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Admin Registry</h1>
                    </div>
                    <p className="text-slate-400 font-medium">System-wide user overview and secure management.</p>
                </div>
                
                <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-3 rounded-2xl text-indigo-400 text-sm font-bold flex items-center gap-2 shadow-xl shadow-indigo-500/5">
                    <Activity size={16} />
                    {users.length} Registered Users
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map((user, index) => (
                    <Card key={user.id} delay={index * 0.05} className="group !pb-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors border border-slate-700/50 group-hover:border-indigo-500/20">
                                <User size={26} />
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border transition-all ${
                                user.role === 'admin' 
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-lg shadow-indigo-500/5' 
                                : 'bg-slate-800 border-slate-700 text-slate-500'
                            }`}>
                                {user.role}
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-extrabold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                                    {user.full_name}
                                </h3>
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-1">
                                    <Mail size={14} className="text-slate-600" />
                                    {user.email}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800/50 flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                <Calendar size={14} />
                                Member Since {new Date(user.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
};

export default Admin;
