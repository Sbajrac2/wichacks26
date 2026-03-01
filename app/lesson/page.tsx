import LessonClient from "./LessonClient";

export default function LessonPage({
  searchParams,
}: {
  searchParams: { scenario?: string };
}) {
  const scenario = searchParams?.scenario ?? "gender-bias";
  return <LessonClient scenario={scenario} />;
}