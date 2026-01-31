"use client";
import React from "react";
import { Edit3, Trash2, Clock, BookOpen, CheckCircle2, ListOrdered, FileText, ChevronRight } from "lucide-react";

interface PassageCardProps {
  passage: any;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PassageCard({ passage, index, onEdit, onDelete }: PassageCardProps) {
  return (
    <div className="group bg-white border border-slate-200 rounded-[40px] p-3 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
      <div className="bg-slate-50/50 rounded-[32px] p-6 border border-white">
        
        {/* --- ১. হেডার: টাইটেল এবং কন্ট্রোলস --- */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm font-black shadow-xl shadow-indigo-100">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div>
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <FileText size={12} className="text-indigo-500" />
                  Reading Comprehension
               </div>
               <h2 className="text-lg font-bold text-slate-800">Passage Content</h2>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={onEdit} className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-2xl shadow-sm border border-slate-100 transition-all active:scale-90">
              <Edit3 size={18} />
            </button>
            <button onClick={onDelete} className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-2xl shadow-sm border border-slate-100 transition-all active:scale-90">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* --- ২. প্যাসেজ বডি: স্ক্রলযোগ্য এবং স্টাইলিশ --- */}
        <div className="relative mb-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar">
           <div className="absolute top-4 right-4 text-indigo-100">
              <BookOpen size={40} />
           </div>
           <div 
             className="text-slate-600 leading-[1.8] whitespace-pre-line prose prose-slate max-w-none"
             dangerouslySetInnerHTML={{ __html: passage.passage }} // যদি এডিটর থেকে HTML আসে
           />
        </div>

        {/* --- ৩. কোয়েশ্চেন লিস্ট --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
             <ListOrdered size={18} className="text-indigo-500" />
             <h3 className="font-black text-slate-400 text-[11px] uppercase tracking-widest">Attached Questions ({passage.questions.length})</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {passage.questions.map((q: any, i: number) => (
              <div key={i} className="bg-white rounded-[24px] p-5 border border-slate-100 hover:border-indigo-200 transition-all shadow-sm">
                <div className="flex justify-between items-start gap-4 mb-4">
                   <p className="font-bold text-slate-800 leading-snug">
                     <span className="text-indigo-500 mr-2">{i + 1}.</span> {q.question}
                   </p>
                   <span className="shrink-0 bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-lg">
                      {q.mark} PTS
                   </span>
                </div>

                {/* অপশন গ্রিড */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((op: string, idx: number) => (
                    <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${op === q.answer ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-slate-50 border-transparent text-slate-500'}`}>
                       <div className={`h-2 w-2 rounded-full ${op === q.answer ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                       {op}
                    </div>
                  ))}
                </div>

                {/* সঠিক উত্তর হাইলাইট */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                   <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                      <CheckCircle2 size={14} />
                      Correct: {q.answer}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ৪. ফুটার --- */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
           <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl border border-indigo-100">
                 <Clock size={14} className="animate-pulse" />
                 <span className="text-xs font-black uppercase tracking-tighter">{passage.duration} Minutes</span>
              </div>
           </div>
           
           <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
              Read carefully <ChevronRight size={14} />
           </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}