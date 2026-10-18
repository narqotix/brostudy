'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';

// Supabase Client Initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface StudySession {
id: string;
user_name: string;
avatar_url: string;
category: string;
topic: string;
room_name: string;
meet_url: string;
started_at: string;
streak_count: number;
}

interface LeaderboardUser {
name: string;
category: string;
hoursWeekly: number;
hoursDaily: number;
streak: number;
avatar: string;
}

export default function BroStudyApp() {
// Live Active Study Sessions Mock State
const [sessions, setSessions] = useState<StudySession[]>([
{
id: 'sess-1',
user_name: 'Aarav Sharma',
avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
category: 'JEE',
topic: 'Rotational Motion & Organic Chemistry Numericals',
room_name: 'JEE Mains & Advanced Focus Room',
meet_url: 'https://meet.google.com/abc-defg-hij',
started_at: new Date(Date.now() - 48 * 60000).toISOString(),
streak_count: 14,
},
{
id: 'sess-2',
user_name: 'Priya Patel',
avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
category: 'NEET',
topic: 'Human Physiology & Plant Kingdom MCQs',
room_name: 'NEET Biology & Physics Hall',
meet_url: 'https://meet.google.com/neet-prep-room',
started_at: new Date(Date.now() - 95 * 60000).toISOString(),
streak_count: 21,
},
{
id: 'sess-3',
user_name: 'Rohan Verma',
avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
category: 'UPSC',
topic: 'Indian Polity Laxmikanth Chapter 12-18',
room_name: 'UPSC & Civil Services Deep Work',
meet_url: 'https://meet.google.com/upsc-prep-hall',
started_at: new Date(Date.now() - 22 * 60000).toISOString(),
streak_count: 9,
},
{
id: 'sess-4',
user_name: 'Sneha Gupta',
avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
category: 'CA / CS',
topic: 'Corporate Laws & Advanced Auditing',
room_name: 'CA Foundation & Inter Room',
meet_url: 'https://meet.google.com/ca-study-room',
started_at: new Date(Date.now() - 110 * 60000).toISOString(),
streak_count: 18,
},
{
id: 'sess-5',
user_name: 'Vikram Singh',
avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
category: '10th Class',
topic: 'Class 10 Board Physics Optics & Electricity',
room_name: 'Class 10th Board Exam Room',
meet_url: 'https://meet.google.com/class10-room',
started_at: new Date(Date.now() - 35 * 60000).toISOString(),
streak_count: 6,
},
]);

const [leaderboard] = useState<LeaderboardUser[]>([
{ name: 'Priya Patel', category: 'NEET', hoursWeekly: 38.5, hoursDaily: 6.8, streak: 21, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
{ name: 'Sneha Gupta', category: 'CA / CS', hoursWeekly: 34.2, hoursDaily: 5.8, streak: 18, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
{ name: 'Aarav Sharma', category: 'JEE', hoursWeekly: 31.5, hoursDaily: 6.2, streak: 14, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
{ name: 'Rohan Verma', category: 'UPSC', hoursWeekly: 28.1, hoursDaily: 4.5, streak: 9, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
]);

const [isModalOpen, setIsModalOpen] = useState(false);
const [activeSession, setActiveSession] = useState<StudySession | null>(null);
const [topic, setTopic] = useState('');
const [category, setCategory] = useState('JEE');
const [selectedPreset, setSelectedPreset] = useState('https://meet.google.com/abc-defg-hij|JEE Mains & Advanced Focus Room');
const [customMeetUrl, setCustomMeetUrl] = useState('');
const [useCustomUrl, setUseCustomUrl] = useState(false);
const [filterCategory, setFilterCategory] = useState('ALL');
const [searchQuery, setSearchQuery] = useState('');

// Timer Ticking Loop
const [, setTicker] = useState(0);
useEffect(() => {
const timer = setInterval(() => setTicker((t) => t + 1), 1000);
return () => clearInterval(timer);
}, []);

// Format Elapsed Duration (HH:MM:SS)
const getElapsed = (startedAt: string) => {
const start = new Date(startedAt).getTime();
const diffSecs = Math.max(0, Math.floor((Date.now() - start) / 1000));
const h = Math.floor(diffSecs / 3600).toString().padStart(2, '0');
const m = Math.floor((diffSecs % 3600) / 60).toString().padStart(2, '0');
const s = (diffSecs % 60).toString().padStart(2, '0');
return ${h}:${m}:${s};
};

const handleStartSession = (e: React.FormEvent) => {
e.preventDefault();
if (!topic.trim()) return;

let finalMeetUrl = customMeetUrl;
let roomName = 'Custom Google Meet Room';

if (!useCustomUrl) {
  const parts = selectedPreset.split('|');
  finalMeetUrl = parts[0];
  roomName = parts[1];
}

if (!finalMeetUrl.includes('meet.google.com')) {
  alert('Please enter a valid Google Meet link!');
  return;
}

const newSession: StudySession = {
  id: `sess-${Date.now()}`,
  user_name: 'You (Alex)',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
  category,
  topic,
  room_name: roomName,
  meet_url: finalMeetUrl,
  started_at: new Date().toISOString(),
  streak_count: 5,
};

setSessions([newSession, ...sessions]);
setActiveSession(newSession);
setIsModalOpen(false);

// Open Google Meet room in new browser tab
window.open(finalMeetUrl, '_blank');


};

const handleEndSession = () => {
if (activeSession) {
setSessions(sessions.filter((s) => s.id !== activeSession.id));
setActiveSession(null);
confetti({ particleCount: 90, spread: 70, origin: { y: 0.8 } });
}
};

// Filter Sessions
const filteredSessions = sessions.filter((s) => {
const matchesCategory = filterCategory === 'ALL' || s.category === filterCategory;
const matchesSearch =
s.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
s.topic.toLowerCase().includes(searchQuery.toLowerCase());
return matchesCategory && matchesSearch;
});

return (

{/* Header Bar */}








brostudy.in


Live Study Hall




      <div className="flex items-center space-x-3">
        <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-full text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-300">{sessions.length} Students Live</span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]"
        >
          <i className="fa-solid fa-play mr-1.5"></i> Check In & Study
        </button>
      </div>
    </div>
  </header>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
    {/* Search & Filter Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
          <span>Live Student Study Hall</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Join live Google Meet rooms for JEE, NEET, UPSC, CA, Class 10th & Engineering. Maintain your daily streak!
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search student or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Categories</option>
          <option value="JEE">JEE Mains / Advanced</option>
          <option value="NEET">NEET Medical</option>
          <option value="10th Class">10th Class Boards</option>
          <option value="12th Class">12th Class Boards</option>
          <option value="Engineering">Engineering / GATE</option>
          <option value="Medical">Medical College</option>
          <option value="UPSC">UPSC Civil Services</option>
          <option value="CA / CS">CA / CS Foundation & Inter</option>
          <option value="SSC / Govt Exams">SSC / Govt Exams</option>
          <option value="Other">Other Studies</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Live Cards Grid */}
      <div className="lg:col-span-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl bg-slate-900 border border-slate-800/90 p-5 shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={session.avatar_url}
                      alt={session.user_name}
                      className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                    />
                    <div>
                      <div className="font-bold text-xs text-white">{session.user_name}</div>
                      <div className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        <i className="fa-solid fa-graduation-cap mr-1"></i>
                        {session.category}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold">
                    🔥 {session.streak_count}d streak
                  </span>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Current Focus Goal
                  </span>
                  <p className="text-xs font-medium text-slate-200">{session.topic}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <i className="fa-solid fa-circle text-[8px] animate-ping mr-1"></i>
                  {getElapsed(session.started_at)}
                </span>
                <a
                  href={session.meet_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center space-x-1"
                >
                  <i className="fa-brands fa-google text-indigo-400 mr-1"></i> Join Meet
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Sidebar */}
      <div className="space-y-6">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
            <i className="fa-solid fa-trophy text-amber-400"></i>
            <h3 className="text-sm font-bold text-white">Study Champions</h3>
          </div>

          <div className="space-y-3">
            {leaderboard.map((user, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-400 w-4">#{idx + 1}</span>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">{user.name}</div>
                    <div className="text-[10px] text-indigo-400 font-semibold">{user.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-indigo-400">
                    {user.hoursWeekly} hrs
                  </div>
                  <div className="text-[10px] text-amber-400">🔥 {user.streak}d</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </main>

  {/* Floating Active Dock */}
  {activeSession && (
    <div className="fixed bottom-6 right-6 bg-slate-900/95 border border-emerald-500/50 p-4 rounded-2xl shadow-2xl flex items-center space-x-4 backdrop-blur-md z-50">
      <div>
        <div className="text-xs font-bold text-emerald-400 flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5"></span>
          Session Active
        </div>
        <div className="text-xs font-mono font-bold">{getElapsed(activeSession.started_at)}</div>
      </div>
      <button
        onClick={handleEndSession}
        className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-3.5 py-2 rounded-xl font-semibold transition"
      >
        End Session
      </button>
    </div>
  )}

  {/* Check-In Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-lg font-bold mb-4 text-white">Start Study Session</h2>
        <form onSubmit={handleStartSession} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
              Exam / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="JEE">JEE Mains / Advanced</option>
              <option value="NEET">NEET Medical</option>
              <option value="10th Class">10th Class Boards</option>
              <option value="12th Class">12th Class Boards</option>
              <option value="Engineering">Engineering / GATE</option>
              <option value="Medical">Medical College</option>
              <option value="UPSC">UPSC Civil Services</option>
              <option value="CA / CS">CA / CS Foundation & Inter</option>
              <option value="SSC / Govt Exams">SSC / Govt Exams</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
              Topic / Target Goal
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Physics Optics / Polity Laxmikanth"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs uppercase font-bold text-slate-400">
                Google Meet Room
              </label>
              <button
                type="button"
                onClick={() => setUseCustomUrl(!useCustomUrl)}
                className="text-[10px] text-indigo-400 underline"
              >
                {useCustomUrl ? 'Preset Rooms' : 'Custom Link'}
              </button>
            </div>

            {useCustomUrl ? (
              <input
                type="url"
                required
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={customMeetUrl}
                onChange={(e) => setCustomMeetUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            ) : (
              <select
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="https://meet.google.com/abc-defg-hij|JEE Mains & Advanced Focus Room">
                  JEE Mains & Advanced Focus Room
                </option>
                <option value="https://meet.google.com/neet-prep-room|NEET Biology & Physics Hall">
                  NEET Biology & Physics Hall
                </option>
                <option value="https://meet.google.com/upsc-prep-hall|UPSC Civil Services Room">
                  UPSC Civil Services Room
                </option>
                <option value="https://meet.google.com/ca-study-room|CA Foundation & Inter Room">
                  CA Foundation & Inter Room
                </option>
                <option value="https://meet.google.com/class10-room|Class 10th Board Study Room">
                  Class 10th Board Study Room
                </option>
              </select>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-xs text-slate-400 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-xl font-semibold"
            >
              Launch & Start
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>


);
}
