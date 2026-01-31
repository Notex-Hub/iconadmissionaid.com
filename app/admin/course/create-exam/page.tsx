"use client";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import CreateExamForm from "./components/CreateExamClient";



const CreateExam = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <CreateExamForm />
    </Suspense>
  );
};

export default CreateExam;
