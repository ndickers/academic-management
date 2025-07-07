import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
export default function CourseCard({
  id,
  course,
  credits,
  syllabus,
  setOpenUpdate,
  setUpdateDetails,
}: {
  id: number;
  course: string;
  credits: number;
  syllabus: string;
  setOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateDetails: React.Dispatch<
    React.SetStateAction<{ title: string; credits: number; id: number }>
  >;
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
            <span className="font-semibold">Course:</span> {course}
          </p>
          <p className="text-sm mt-1.5">
            <span className="font-semibold">Credits:</span> {credits}
          </p>
        </CardContent>
      </Box>
      <div className=" pr-2.5">
        <button
          onClick={() => {
            setOpenUpdate(true);
            setUpdateDetails({ credits, title: course, id });
          }}
          className="block ml-auto border border-orange-400 p-0.5 rounded-sm"
        >
          <EditIcon />
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
