import { useNavigate, useParams } from "react-router-dom";
import { useGetAllSubjectQuery } from "../../../redux/Features/Api/subject/subject";
import { useGetAllModelTestQuery } from "../../../redux/Features/Api/modelTest/modelTest";

const NextStep = () => {
  const { modelSlug, subjectId, sectionName } = useParams();
  const navigate = useNavigate();

  const { data: subjects } = useGetAllSubjectQuery();
  const { data: modelTests } = useGetAllModelTestQuery();

  const modelTest = modelTests?.data?.find((m) => m.slug === modelSlug);

  const subjectList = subjects?.data?.filter(
    (s) => s?.modelTest?.slug === modelSlug
  );

  const orderedSubjects = subjectList?.sort((a, b) => {
    const order = modelTest?.sectionsOrderForSubject;
    const indexA = order.indexOf(a.title);
    const indexB = order.indexOf(b.title);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  const currentSubject = orderedSubjects?.find(s => s._id === subjectId);
  const subjectIndex = orderedSubjects?.indexOf(currentSubject);

  const englishOrder = modelTest?.sectionsOrderForEnglish;
  const sections = currentSubject?.title === "English" ? englishOrder : ["MCQ"];

  const currentSectionIndex = sections?.indexOf(sectionName);

  // 1) Next section exists → go there
  if (currentSectionIndex + 1 < sections?.length) {
    const nextSection = sections[currentSectionIndex + 1];

    return navigate(
      `/exam/run/${modelSlug}/${currentSubject._id}/${nextSection}`
    );
  }

  // 2) No more sections → go next subject
  if (subjectIndex + 1 < orderedSubjects?.length) {
    const nextSubject = orderedSubjects[subjectIndex + 1];
    const firstSection = nextSubject?.title === "Bangla"
      ? englishOrder[0]
      : "MCQ";

    return navigate(
      `/exam/run/${modelSlug}/${nextSubject._id}/${firstSection}`
    );
  }

  // 3) All finished → show result modal
  navigate(`/exam/result/${modelSlug}`);
};
export default NextStep;