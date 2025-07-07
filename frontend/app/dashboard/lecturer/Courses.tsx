import React, { useState } from "react";
import BasicModal from "../../../components/Modal";
import CourseForm from "@/components/Forms/CourseForm";
import CourseCard from "../../../components/Card";
import useSWR from "swr";
import { getLecCourses } from "@/api/courseApi/page";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Spinner } from "flowbite-react";
import UpdateCourse from "@/components/Forms/UpdateCourse";
import { logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";

export interface TypeCourse {
  title: string;
  credits: number;
  syllabus: string;
  id: number;
}

export default function Courses() {
  const [open, setOpen] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [updateDetails, setUpdateDetails] = React.useState<{
    id: number;
    title: string;
    credits: number;
  } | null>(null);
  const { data, error, isLoading } = useSWR(
    ["course", user.id, token],
    getLecCourses
  );

  console.log({ updateDetails });

  return (
    <div className="p-8">
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        Add Course
      </button>
      <button
        onClick={() => {
          dispatch(logout());
          router.push("/auth/login");
        }}
      >
        logout
      </button>
      <div className="flex flex-wrap gap-6">
        {isLoading ? (
          <Spinner aria-label="Extra large spinner example" size="xl" />
        ) : (
          data.map(({ title, credits, syllabus, id }: TypeCourse) => (
            <CourseCard
              key={id}
              course={title}
              credits={credits}
              id={id}
              setOpenUpdate={setOpenUpdate}
              setUpdateDetails={setUpdateDetails}
              syllabus={syllabus}
            />
          ))
        )}
      </div>
      <BasicModal open={open} setOpen={setOpen}>
        <CourseForm setOpen={setOpen} />
      </BasicModal>
      <BasicModal
        open={openUpdate}
        setUpdateDetails={setUpdateDetails}
        setOpen={setOpenUpdate}
      >
        <UpdateCourse updateDetails={updateDetails} setOpen={setOpenUpdate} />
      </BasicModal>
    </div>
  );
}
