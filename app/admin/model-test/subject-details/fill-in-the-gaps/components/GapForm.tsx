"use client";

import React, { useEffect, useCallback } from "react";
import { Edit3, Clock, Award, Info, PlusCircle, Trash2 } from "lucide-react";
import SimpleEditor from "../../mcq/components/SimpleEditor";

type GapPayload = {
  question: string;
  answers: string[];
  duration: number;
  mark: number;
};

interface GapFormProps {
  value: GapPayload;
  setValue: (v: GapPayload) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitting?: boolean;
}

export default function GapForm({ value, setValue, onCancel, onSubmit, submitting }: GapFormProps) {
  
  // underscores count logic
  useEffect(() => {
    const gapsFound = (value.question.match(/___/g) || []).length;
    
    if (gapsFound !== value.answers.length) {
      const newAnswers = [...value.answers];
      if (gapsFound > value.answers.length) {
        for (let i = value.answers.length; i < gapsFound; i++) {
          newAnswers.push("");
        }
      } else {
        newAnswers.splice(gapsFound);
      }
      setValue({ ...value, answers: newAnswers });
    }
  }, [value.question]);

  const updateAnswer = (idx: number, v: string) => {
    const arr = [...value.answers];
    arr[idx] = v;
    setValue({ ...value, answers: arr });
  };

  // নির্দিষ্ট ইনডেক্সের blank এবং এডিটর থেকে '___' রিমুভ করার ফাংশন
  const removeGap = useCallback((indexToRemove: number) => {
    let count = 0;
    // এডিটরের কন্টেন্ট থেকে ঠিক ওই ইনডেক্সের ___ রিমুভ করবে
    const newQuestion = value.question.replace(/___/g, (match) => {
      if (count === indexToRemove) {
        count++;
        return ""; // রিমুভ করে খালি করে দিবে
      }
      count++;
      return match;
    });

    setValue({ ...value, question: newQuestion });
  }, [value, setValue]);

  return (
    <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
      
      {/* 1. Editor Section */}
      <div className="bg-white rounded-[24px] border-2 border-slate-100 p-1 focus-within:border-indigo-500 transition-all">
        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest p-4 pb-2">
          <Edit3 size={14} className="text-indigo-500" /> Question Editor
        </label>
        
        <SimpleEditor 
          value={value.question} 
          onChange={(content) => setValue({ ...value, question: content })} 
        />
        
        <div className="m-4 mt-2 flex items-start gap-2 text-indigo-600/70 bg-indigo-50/50 p-3 rounded-xl">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium leading-tight">
            Type <span className="font-black underline text-indigo-700">___</span> to add a blank. Deleting a box below will remove its underscore.
          </p>
        </div>
      </div>

      {/* 2. Dynamic Answers Section with Delete Option */}
      {value.answers.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">
             Define Blank Answers ({value.answers.length})
          </label>
          
          <div className="max-h-[300px] overflow-y-auto p-1 grid grid-cols-1 gap-3 pr-2">
            {value.answers.map((a, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-sm">
                <span className="h-7 w-7 shrink-0 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black italic">
                  #{i + 1}
                </span>
                
                <input
                  className="bg-transparent w-full text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                  value={a}
                  onChange={(e) => updateAnswer(i, e.target.value)}
                  placeholder={`Correct answer for gap ${i + 1}`}
                />

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeGap(i)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="Remove this blank"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Stats Summary */}
      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={12} /> Duration</span>
          <input
            type="number"
            value={value.duration}
            onChange={(e) => setValue({ ...value, duration: Number(e.target.value) })}
            className="bg-transparent text-lg font-black text-slate-700 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Award size={12} /> Total Marks</span>
          <input
            type="number"
            value={value.mark}
            onChange={(e) => setValue({ ...value, mark: Number(e.target.value) })}
            className="bg-transparent text-lg font-black text-slate-700 outline-none"
          />
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white/80 backdrop-blur-sm pb-2 z-10">
        <button onClick={onCancel} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
        >
          {submitting ? "Saving..." : <><PlusCircle size={18} /> Save Task</>}
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}