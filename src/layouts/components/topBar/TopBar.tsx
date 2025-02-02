"use client";

import { BsList } from "react-icons/bs";
import Breadcrumbs from "../Breadcrumbs";
import Timer from "./Timer";
import FullScreen from "./FullScreen";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useDevelop } from "@/store/store";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import QuestionsDrawer from "./QuestionsDrawer";
import { useState } from "react";
import QuestionCard from "./QuestionCard";

const mockData = [
  {
    id: 1,
    title: "שאלה במטריצות",
    difficulty: "קשה",
    status: "FINISH",
  },
  {
    id: 6,
    title: "אי רציפות",
    difficulty: "קל",
    status: "BEGIN",
  },
  {
    id: 24,
    title: "משפט לופיטל",
    difficulty: "בינוני",
    status: "STUCK",
  },
];

const TopBar = (problemId: any) => {
  const pathname = usePathname().split("/");
  const course = pathname[2];
  const chapter = pathname[3];
  const currentQuestion = decodeURIComponent(pathname[4].replaceAll('-',' '));
  const [open, setOpen] = useState(false);
  const { development } = useDevelop();

  const { data, isLoading: isLoadingData } = useQuery({
    queryKey: ["topbar", course, chapter],
    queryFn: async () => {
      if (development) return null;
      const query = `/api/getTopBar?course=${course}&chapter=${chapter}&problemId=${problemId.problemId}`;
      const { data } = await axios.get(query);
      return data;
    },
  });

  return (
    <section>
      <QuestionsDrawer isOpen={open} setOpen={setOpen}>
        <div className="rounded-xl mt-5">
        {data &&
          data.problems &&
          data.problems.map((item: any, index:any) => (
            <div key={index}>
              <QuestionCard
                title={item.title}
                difficulty={item.difficulty}
                status={item.status}
                currentQuestion={currentQuestion}
                url={`/courses/${course}/${chapter}/${item.title.replaceAll(' ', '-')}`}
              />
           </div>
          ))}
          </div>
      </QuestionsDrawer>
      <div className="text-center mx-auto rounded px-12 my-5">
        <div className="flex justify-between gap-2 rounded bg-gradient-to-b from-body to-theme-light px-8  dark:from-darkmode-body dark:to-darkmode-theme-light">
          <div className="flex items-center justify-between h-6 w-20 cursor-pointer">
            <span
              title="שאלה קודמת"
              className="rounded border text-zinc-600 dark:text-zinc-300 border-zinc-500 hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white"
            >
              {data ? (
                <Link href={data.prevLink}>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    height="22"
                    width="22"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              ) : (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  height="22"
                  width="22"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
            <span
              title="עוד שאלות"
              className="h-6 w-6 rounded border text-zinc-600 dark:text-zinc-300 border-zinc-500 hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white"
            >
              {data ? (
                <button onClick={() => setOpen(true)}>
                  <BsList />
                </button>
              ) : (
                <button>
                  <BsList />
                </button>
              )}
            </span>
            <span
              title="שאלה הבאה"
              className="rounded border text-zinc-600 dark:text-zinc-300 border-zinc-500 hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white"
            >
              {data ? (
                <Link href={data.nextLink}>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    height="22"
                    width="22"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              ) : (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  height="22"
                  width="22"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
          </div>
          <Breadcrumbs />
          <div className="container-right-top-bar">
            <Timer />
            <FullScreen />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
