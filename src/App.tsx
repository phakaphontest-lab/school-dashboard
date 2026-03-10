import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  History, 
  Database, 
  FileText, 
  BarChart2, 
  PieChart,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  User,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface SupervisionData {
  id: number;
  teacher: string;
  department: string;
  date: string;
  score: number;
  observer: string;
  status: string;
}

interface Stats {
  total: number;
  completed: number;
  pending: number;
  averageScore: number;
  departmentStats: { name: string; count: number; avg: number }[];
}

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  key?: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
        : "text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
    )}
  >
    <Icon size={20} className={cn(active ? "text-white" : "group-hover:scale-110 transition-transform")} />
    <span className="font-medium text-sm">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-pill" 
        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
      />
    )}
  </button>
);

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-3xl font-bold text-slate-800">{value}</div>
  </div>
);

// --- Pages ---

const Dashboard = ({ stats }: { stats: Stats | null }) => {
  if (!stats) return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="การนิเทศทั้งหมด" value={stats.total} icon={ClipboardCheck} color="bg-blue-500" />
        <StatCard label="เสร็จสิ้นแล้ว" value={stats.completed} icon={LayoutDashboard} color="bg-emerald-500" />
        <StatCard label="รอดำเนินการ" value={stats.pending} icon={History} color="bg-amber-500" />
        <StatCard label="คะแนนเฉลี่ย" value={stats.averageScore} icon={BarChart2} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">สถิติการนิเทศแยกตามกลุ่มสาระ</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.departmentStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">คะแนนเฉลี่ยแยกตามกลุ่มสาระ</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.departmentStats}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="avg" stroke="#10b981" fillOpacity={1} fill="url(#colorAvg)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryTable = ({ data }: { data: SupervisionData[] }) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
    <div className="p-6 border-bottom border-slate-50 flex justify-between items-center">
      <h3 className="text-lg font-semibold text-slate-800">ประวัติการนิเทศ</h3>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="ค้นหาชื่อครู..." 
          className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-64"
        />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <th className="px-6 py-4 font-semibold">ชื่อผู้รับการนิเทศ</th>
            <th className="px-6 py-4 font-semibold">กลุ่มสาระ</th>
            <th className="px-6 py-4 font-semibold">วันที่</th>
            <th className="px-6 py-4 font-semibold">ผู้นิเทศ</th>
            <th className="px-6 py-4 font-semibold">คะแนน</th>
            <th className="px-6 py-4 font-semibold">สถานะ</th>
            <th className="px-6 py-4 font-semibold"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-700">{item.teacher}</td>
              <td className="px-6 py-4 text-slate-500 text-sm">{item.department}</td>
              <td className="px-6 py-4 text-slate-500 text-sm">{item.date}</td>
              <td className="px-6 py-4 text-slate-500 text-sm">{item.observer}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500" 
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item.score}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                  item.status === "เสร็จสิ้น" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                )}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SupervisionForm = () => (
  <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">แบบบันทึกการนิเทศ</h2>
          <p className="text-slate-500 mt-1">กรุณากรอกข้อมูลการนิเทศการจัดการเรียนการสอน</p>
        </div>
        <a 
          href="https://docs.google.com/forms/d/1pHBvyj24HSDOhhxQgSyFjkRH_GTIcjyxEIwJdCQuJ6o/viewform" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
        >
          <ExternalLink size={18} />
          <span>เปิดใน Google Forms</span>
        </a>
      </div>
      
      <div className="w-full h-[600px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
        <ClipboardCheck size={48} className="mb-4 opacity-20" />
        <p className="text-center max-w-md">
          คุณสามารถฝัง Google Form ได้ที่นี่ หรือใช้ปุ่มด้านบนเพื่อเปิดฟอร์มในหน้าต่างใหม่
        </p>
      </div>
    </div>
  </div>
);

const ComparisonView = ({ stats }: { stats: Stats | null }) => {
  if (!stats) return null;
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-slate-800">เปรียบเทียบผลการนิเทศรายกลุ่มสาระ</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.departmentStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="avg" name="คะแนนเฉลี่ย" radius={[0, 6, 6, 0]} barSize={30}>
                {stats.departmentStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.avg > 4 ? '#10b981' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const DetailsView = ({ data }: { data: SupervisionData[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {data.map((item) => (
      <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-slate-800 text-lg">{item.teacher}</h4>
            <p className="text-sm text-slate-500">{item.department}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">{item.score}</div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">คะแนนรวม</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">วันที่นิเทศ:</span>
            <span className="text-slate-700 font-medium">{item.date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">ผู้นิเทศ:</span>
            <span className="text-slate-700 font-medium">{item.observer}</span>
          </div>
          <div className="pt-3 border-t border-slate-50">
            <p className="text-xs text-slate-400 mb-2">ข้อเสนอแนะเบื้องต้น:</p>
            <p className="text-sm text-slate-600 italic">"การจัดการเรียนการสอนมีความน่าสนใจ นักเรียนมีส่วนร่วมได้ดี ควรเพิ่มสื่อเทคโนโลยีให้หลากหลายมากขึ้น"</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('สรุปภาพรวม');
  const [data, setData] = useState<SupervisionData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Fetch data from API
    fetch('/api/supervision-data')
      .then(res => res.json())
      .then(setData);
    
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats);
  }, []);

  const menuItems = [
    { id: 'สรุปภาพรวม', label: 'สรุปภาพรวม', icon: LayoutDashboard },
    { id: 'การนิเทศ', label: 'การนิเทศ', icon: ClipboardCheck },
    { id: 'ประวัติการนิเทศ', label: 'ประวัติการนิเทศ', icon: History },
    { id: 'ข้อมูลการนิเทศ', label: 'ข้อมูลการนิเทศ', icon: Database },
    { id: 'รายละเอียด', label: 'รายละเอียด', icon: FileText },
    { id: 'เปรียบเทียบ', label: 'เปรียบเทียบ', icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-white border-r border-slate-100 flex flex-col z-20"
      >
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <PieChart className="text-white" size={24} />
          </div>
          <div className="overflow-hidden whitespace-nowrap">
            <h1 className="font-bold text-lg text-slate-800 leading-tight">ระบบนิเทศ</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Instructional Supervision</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-700 truncate">Administrator</p>
              <p className="text-xs text-slate-400 truncate">admin@school.ac.th</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-xl font-bold text-slate-800">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="ค้นหา..." 
                className="bg-transparent border-none text-sm focus:ring-0 w-48"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
              <User size={20} />
              <span className="text-sm font-medium hidden sm:inline">โปรไฟล์</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'สรุปภาพรวม' && <Dashboard stats={stats} />}
              {activeTab === 'การนิเทศ' && <SupervisionForm />}
              {activeTab === 'ประวัติการนิเทศ' && <HistoryTable data={data} />}
              {activeTab === 'ข้อมูลการนิเทศ' && (
                <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
                  <Database size={48} className="mx-auto mb-4 text-slate-200" />
                  <h3 className="text-xl font-bold text-slate-800">ข้อมูลการนิเทศดิบ</h3>
                  <p className="text-slate-500 mt-2">ส่วนนี้แสดงข้อมูลทั้งหมดจาก Google Sheets ในรูปแบบตารางที่สามารถกรองและส่งออกได้</p>
                  <div className="mt-8 flex justify-center gap-4">
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                      เชื่อมต่อ Google Sheets
                    </button>
                    <a 
                      href="https://docs.google.com/spreadsheets/d/117U2AWnItcYFY3FtBlut7Vk6NIh-mr3SjorNu4_aecc/edit" 
                      target="_blank" 
                      className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                    >
                      เปิดไฟล์ต้นฉบับ
                    </a>
                  </div>
                </div>
              )}
              {activeTab === 'รายละเอียด' && <DetailsView data={data} />}
              {activeTab === 'เปรียบเทียบ' && <ComparisonView stats={stats} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
