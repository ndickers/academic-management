import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "next/link";
export default function CourseCard({
  title,
  credits,
  syllabus,
  status,
  id,
  setCourseId,
  setOpen,
  setOpenAssign,
}: {
  title: string;
  credits: number;
  syllabus: string;
  status: string;
  id: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenAssign: React.Dispatch<React.SetStateAction<boolean>>;
  setCourseId: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  return (
    <Card
      className="w-[21rem]"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        justifyItems: "center",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <p className="text-sm">
            <span className="font-semibold">Course:</span> {title}
          </p>
          <p className="text-sm mt-1.5">
            <span className="font-semibold">Credits:</span> {credits}
          </p>
          <p className="text-xs mt-1.5">
            <span className="font-semibold">Status:</span>
            <span
              className={`ml-4 ${status === "APPROVED" ? "text-[#22C55E]" : status === "PENDING" ? "text-[#FACC15]" : "text-[#EF4444]"} rounded-xl px-2`}
            >
              {status}
            </span>
          </p>
        </CardContent>
      </Box>
      <div className="flex flex-col justify-center items-end">
        <button
          onClick={() => {
            setOpen(true);
            setCourseId(id);
          }}
          className=" bg-red-400 inline-block text-xs mt-5 text-nowrap px-2 rounded-sm"
        >
          drop course
        </button>
        <Link
          className="my-auto text-xs underline text-nowrap text-blue-600"
          href={`${process.env.NEXT_PUBLIC_IMAGE}/${syllabus}`}
        >
          View syllabus
        </Link>
        {status === "APPROVED" && (
          <button
            onClick={() => {
              setCourseId(id);
              setOpenAssign(true);
            }}
            className="text-xs text-nowrap mb-5 bg-blue-600 px-2 rounded-xs"
          >
            submit assignment
          </button>
        )}
      </div>
    </Card>
  );
}
