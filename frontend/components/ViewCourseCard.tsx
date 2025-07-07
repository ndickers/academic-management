import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "next/link";
export default function CourseCard({
  title,
  credits,
  syllabus,
  id,
  setCourseId,
  setOpen,
}: {
  title: string;
  credits: number;
  syllabus: string;
  id: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
        </CardContent>
      </Box>
      <div className=" pr-2.5">
        <button
          onClick={() => {
            setOpen(true);
            setCourseId(id);
          }}
          className="block ml-auto bg-green-400 mt-4  px-2 rounded-sm"
        >
          enroll
        </button>
        <Link
          className="my-auto text-xs underline text-blue-600"
          href={`${process.env.NEXT_PUBLIC_IMAGE}/${syllabus}`}
        >
          View syllabus
        </Link>
      </div>
    </Card>
  );
}
