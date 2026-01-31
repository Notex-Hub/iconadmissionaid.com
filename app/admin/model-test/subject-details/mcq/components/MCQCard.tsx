"use client";
import React from "react";
import { Edit3, Trash2, CheckCircle2, Image as ImageIcon } from "lucide-react";

export default function MCQCard({ mcq, index, onEdit, onDelete }) {
  // Extract Question Image
  const qImgMatch = mcq.question.match(/<img[^>]+src="([^">]+)"/);
  const qImageUrl = qImgMatch ? qImgMatch[1] : mcq.questionImg;

  // Helper to extract image from option string
  const getOptImg = (optStr: string) => {
    const match = optStr.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200 relative">
      
      {/* Floating Actions */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={() => onEdit(mcq)} className="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100"><Edit3 size={14} /></button>
        <button onClick={() => onDelete(mcq._id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={14} /></button>
      </div>

      <div className="flex gap-3">
        {/* Index */}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          {/* Question Section */}
          <div className="flex justify-between gap-3 mb-4">
            <div 
              className="text-sm font-bold text-slate-800 leading-tight line-clamp-2 rich-content"
              dangerouslySetInnerHTML={{ __html: mcq.question.replace(/<img[^>]*>/g, "") }}
            />
            {qImageUrl && (
              <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                <img src={qImageUrl} alt="q" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          {/* Options Grid - Height restricted for images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mcq.options.map((opt: string, i: number) => {
              const isCorrect = opt === mcq.correctAnswer;
              const optImg = getOptImg(opt);
              const cleanOpt = opt.replace(/<img[^>]*>/g, ""); // Remove image tag from text

              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                    isCorrect 
                    ? "bg-emerald-50 border-emerald-300 ring-1 ring-emerald-100" 
                    : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <span className="text-[10px] font-bold opacity-30 shrink-0">{String.fromCharCode(65 + i)}</span>
                  
                  {/* Option Image Thumbnail */}
                  {optImg && (
                    <div className="h-10 w-10 shrink-0 rounded bg-white border border-slate-200 overflow-hidden">
                      <img src={optImg} alt="opt" className="h-full w-full object-contain p-0.5" />
                    </div>
                  )}

                  <div 
                    className={`text-[13px] truncate flex-1 ${isCorrect ? "text-emerald-700 font-bold" : "text-slate-600"}`}
                    dangerouslySetInnerHTML={{ __html: cleanOpt || (optImg ? "" : "") }}
                  />
                  
                  {isCorrect && <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .rich-content p { display: inline; }
        .rich-content img { display: none !important; }
      `}</style>
    </div>
  );
}