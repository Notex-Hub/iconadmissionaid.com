"use client";
import React from "react";
import { Edit3, Trash2, Clock, Award, Calendar, CheckCircle2, ChevronRight } from "lucide-react";

interface GapCardProps {
  gap: any;
  index: number;
  onEdit: (g: any) => void;
  onDelete: (id: string) => void;
}

export default function GapCard({ gap, index, onEdit, onDelete }: GapCardProps) {
  
  // HTML কন্টেন্ট থেকে গ্যাপগুলোকে স্টাইলিশ বক্সে রূপান্তর করার ফাংশন
  const renderRichQuestion = (htmlContent: string) => {
    const parts = htmlContent.split("___");
    return parts.map((p, i) => (
      <React.Fragment key={i}>
        <span dangerouslySetInnerHTML={{ __html: p }} />
        {i < parts.length - 1 && (
          <span className="inline-flex items-baseline px-3 mx-1 bg-indigo-50 border-b-2 border-indigo-500 text-indigo-700 font-black text-xs rounded-t-lg shadow-sm min-w-[80px] justify-center h-7 select-none animate-pulse-slow">
             GAP {i + 1}
          </span>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-[40px] p-3 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
      <div className="bg-slate-50/50 rounded-[32px] p-6 border border-white">
        
        {/* --- ১. উপরের অংশ: ইন্ডেক্স এবং অ্যাকশনস --- */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shadow-xl shadow-slate-200">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div>
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <Calendar size={12} className="text-indigo-500" />
                  {new Date(gap.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
               </div>
               <div className="text-[10px] font-bold text-indigo-500 uppercase mt-0.5">Fill in the Blanks</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(gap)}
              className="p-3 bg-white text-slate-400 hover:text-amber-600 rounded-2xl shadow-sm border border-slate-100 hover:border-amber-200 transition-all active:scale-90"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={() => onDelete(gap._id)}
              className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-2xl shadow-sm border border-slate-100 hover:border-red-200 transition-all active:scale-90"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* --- ২. মেইন প্রশ্ন: Rich Content --- */}
        <div className="mb-8 px-2">
          <div className="text-xl font-bold text-slate-800 leading-[1.8] tracking-tight">
            {renderRichQuestion(gap.question)}
          </div>
        </div>

        {/* --- ৩. অ্যানসার গ্রিড: আধুনিক কার্ড স্টাইল --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {gap.answers?.map((a: string, i: number) => (
            <div key={i} className="relative group/ans bg-white p-4 rounded-3xl border border-slate-100 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black border border-emerald-100">
                  {i + 1}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Answer</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{a}</p>
                </div>
                <CheckCircle2 size={18} className="text-emerald-500 opacity-20 group-hover/ans:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {/* --- ৪. ফুটার: মেটাডেটা ব্যাজ --- */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
           <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow-lg shadow-indigo-100">
                 <Award size={14} />
                 <span className="text-xs font-black uppercase tracking-tighter">{gap.mark} Marks</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-100 text-slate-500 px-4 py-2 rounded-2xl shadow-sm">
                 <Clock size={14} className="text-amber-500" />
                 <span className="text-xs font-black uppercase tracking-tighter">{gap.duration} Min</span>
              </div>
           </div>
           
           <div className="hidden md:flex items-center gap-1 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              Exam Ready <ChevronRight size={14} />
           </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}