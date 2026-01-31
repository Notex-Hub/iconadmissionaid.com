// types/modelTest.ts
export type ModelTestItem = {
  _id: string;
  slug: string;
  title: string;
  university: string;
  departments: string[];
  image?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  sectionsOrderForEnglish?: ("MCQ" | "CQ" | "FillInTheGaps" | "SA")[];
  sectionsOrderForSubject?: ("English" | "Math" | "Physics" | "Chemistry")[];
  testType?: "in-course" | "out-of-course";
  courseId?: string;
  pricingType?: "free" | "paid";
  price?: number;
};

export type ApiResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: ModelTestItem[];
};
