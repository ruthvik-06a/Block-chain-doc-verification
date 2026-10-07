'use client';

import React, { useEffect, useState } from 'react';
import { Users, Shield, CheckCircle2, Lock } from 'lucide-react';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ISSUER' | 'VERIFIER' | 'PUBLIC_USER';
  organizationName?: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-sky-400" />
          Role-Based Access Control (RBAC)
        </h1>
        <p className="text-sm text-slate-400 mt-1">Manage user permissions across Super Admin, Issuer, Verifier, and Public roles.</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-lg text-white">Registered Users & Assigned Roles</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Organization</th>
                <th className="py-3 px-2 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-2 text-white font-bold">{u.name}</td>
                  <td className="py-3 px-2 text-slate-300 font-mono">{u.email}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      u.role === 'SUPER_ADMIN' ? 'bg-purple-950 text-purple-300 border-purple-800' :
                      u.role === 'ISSUER' ? 'bg-sky-950 text-sky-300 border-sky-800' :
                      u.role === 'VERIFIER' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-400">{u.organizationName || 'System Global'}</td>
                  <td className="py-3 px-2 text-right font-mono text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
