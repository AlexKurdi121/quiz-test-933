import { Dispatch, SetStateAction } from "react";

type SidebarProps = {
  active: 'quiz';
  setActive: Dispatch<SetStateAction<'quiz'>>;
};

export default function Sidebar({ active, setActive }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col p-6 border-r border-gray-700">
      <h1 className="text-2xl font-bold mb-8">Quiz Manager</h1>

      <nav className="flex flex-col gap-3">
        <button
          onClick={() => setActive("quiz")}
          className={`p-3 rounded font-semibold text-left ${
            active === "quiz" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          Quizzes
        </button>
        
      </nav>

      <div className="mt-auto text-gray-400 text-sm">
        Powered by Next.js + Prisma + Supabase
      </div>
    </div>
  );
}
