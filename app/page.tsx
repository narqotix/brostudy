'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface StudySession {
id: string;
user_name: string;
category: string;
topic: string;
room_name: string;
meet_url: string;
started_at: string;
streak_count: number;
}

export default function BroStudyApp() {
const [sessions, setSessions] = useState<StudySession[]>([
{
id: 'demo-1',
user_name: 'Aarav Sharma',
category: 'JEE',
topic: 'HC Verma Physics - Rotation & Mechanics',
room_name: 'JEE Mains & Advanced Focus Hall',
meet_url: 'https://meet.google.com/abc-defg-hij',
started_at: new Date(Date.now() - 42 * 60000).toISOString(),
streak_count: 12,
},
{
id: 'demo-2',
user_name: 'Priya Patel',
category: 'NEET',
topic: 'NCERT Biology - Human Physiology',
room_name: 'NEET Bio & Chem Room',
meet_url: 'https://meet.google.com/neet-bio-room',
started_at: new Date(Date.now() - 85 * 60000).toISOString(),
streak_count: 8,
},
{
id: 'demo-3',
user_name: 'Rohan Verma',
category: 'Engineering',
topic: 'LeetCode Dynamic Programming & Graphs',
room_name: 'CSE & Coding Study Hall',
meet_url: 'https://meet.google.com/cse-code-room',
started_at: new Date(Date.now() - 15 * 60000).toISOString(),
streak_count: 5,
},
]);

const [isModalOpen, setIsModalOpen] = useState(false);
const [activeSession, setActiveSession] = useState<StudySession | null>(null);
const [topic, setTopic] = useState('');
const [category, setCategory] = useState('JEE');
const [meetUrl, setMeetUrl] = useState('https://meet.google.com/abc-defg-hij');
const [filterCategory, setFilterCategory] = useState('ALL');

const [, setTicker] = useState(0);
useEffect(() => {
const timer = setInterval(() => setTicker((t) => t + 1), 1000);
return () => clearInterval(timer);
}, []);

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

const newSession: StudySession = {
  id: `sess-${Date.now()}`,
  user_name: 'You (BroStudy Member)',
  category,
  topic,
  room_name: `${category} Study Room`,
  meet_url: meetUrl,
  started_at: new Date().toISOString(),
  streak_count: 1,
};

setSessions([newSession, ...sessions]);
setActiveSession(newSession);
setIsModalOpen(false);

window.open(meetUrl, '_blank');


};

const handleEndSession = () => {
if (activeSession) {
setSessions(sessions.filter((s) => s.id !== activeSession.id));
setActiveSession(null);
confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
}
};

const filteredSessions = sessions.filter(
(s) => filterCategory === 'ALL' || s.category === filterCategory
);

return (








BroStudy.in




    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
    >
      <i className="fa-solid fa-play text-[10px]"></i>
      <span>Check In & Study</span>
    </button>
  </header>

  <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-xl font-bold mb-1">Live Study Hall</h1>
        <p className="text-xs text-slate-400">
          Students preparing right now for JEE, NEET, UPSC, CA, Engineering & Boards.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-xs text-slate-400 font-medium">Category:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="ALL">All Categories</option>
          <option value="JEE">JEE</option>
          <option value="NEET">NEET</option>
          <option value="10th Class">10th Class</option>
          <option value="12th Class">12th Class</option>
          <option value="Engineering">Engineering</option>
          <option value="Medical">Medical</option>
          <option value="UPSC">UPSC</option>
          <option value="CA / CS">CA / CS</option>
          <option value="SSC / Govt Exams">SSC / Govt Exams</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredSessions.map((session) => (
        <div
          key={session.id}
          className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-sm text-white">{session.user_name}</div>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                🔥 {session.streak_count}d streak
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-semibold text-[10px] mr-2">
                {session.category}
              </span>
            </p>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800/80 mb-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Focus Topic</span>
              <p className="text-xs font-semibold text-slate-200">{session.topic}</p>
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
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 transition"
            >
              <i className="fa-brands fa-google mr-1 text-indigo-400"></i> Join Meet
            </a>
          </div>
        </div>
      ))}
    </div>
  </main>

  {activeSession && (
    <div className="fixed bottom-6 right-6 bg-slate-900 border border-emerald-500/50 p-4 rounded-2xl shadow-2xl flex items-center space-x-4 z-50">
      <div>
        <div className="text-xs font-bold text-emerald-400 flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5"></span>
          Session Active
        </div>
        <div className="text-xs font-mono font-bold">{getElapsed(activeSession.started_at)}</div>
      </div>
      <button
        onClick={handleEndSession}
        className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-3 py-2 rounded-xl font-semibold transition"
      >
        End Session
      </button>
    </div>
  )}

  {isModalOpen && (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Start Study Session</h2>
        <form onSubmit={handleStartSession} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Category / Exam</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
              <option value="10th Class">10th Class</option>
              <option value="12th Class">12th Class</option>
              <option value="Engineering">Engineering</option>
              <option value="Medical">Medical</option>
              <option value="UPSC">UPSC</option>
              <option value="CA / CS">CA / CS</option>
              <option value="SSC / Govt Exams">SSC / Govt Exams</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">What are you studying?</label>
            <input
              type="text"
              required
              placeholder="e.g. HC Verma Mechanics / Organic Chemistry"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Google Meet Link</label>
            <input
              type="url"
              required
              value={meetUrl}
              onChange={(e) => setMeetUrl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
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
