import React, { useState } from "react";
import CourseCard from "../../../components/ViewCourseCard";
import useSWR, { mutate } from "swr";
import { getViewStudentCourse } from "@/api/courseApi/page";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Spinner } from "flowbite-react";
import { logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import BasicModal from "../../../components/Modal";
import { enrollCourse, EnrollType } from "@/api/enrollment/page";
import { toast } from "react-toastify";

export interface TypeCourse {
  title: string;
  credits: number;
  syllabus: string;
  id: number;
}

export default function Courses() {
  const [open, setOpen] = React.useState(false);
  const { user, token } = useAppSelector((state) => state.auth);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    ["not-enrolled", user.id, token],
    getViewStudentCourse
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const enrollData = {
      courseId,
      studentId: user.id,
      status: "PENDING",
    };

    const created = await enrollCourse({
      data: enrollData as any,
      accessToken: token as string,
    });
    if (created) {
      setLoading(false);
      setOpen(false);
      if ("statusText" in created && created.statusText === "Created") {
        mutate(["not-enrolled", user.id, token]);
        mutate(["enrolled", user.id, token]);
        toast.success(created.data.message, { toastId: "created" });
      } else {
        toast.error(created?.data.message || "Something went wrong", {
          toastId: "error",
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <button
        className="ml-auto bg-red-400 px-4 rounded-sm block"
        onClick={() => {
          router.push("/auth/login");
          dispatch(logout());
        }}
      >
        logout
      </button>
      <div className="flex flex-wrap gap-6">
        {isLoading ? (
          <Spinner aria-label="Extra large spinner example" size="xl" />
        ) : data ? (
          data.map(({ title, credits, syllabus, id }: TypeCourse) => (
            <CourseCard
              key={id}
              title={title}
              syllabus={syllabus}
              id={id}
              credits={credits}
              setCourseId={setCourseId}
              setOpen={setOpen}
            />
          ))
        ) : (
          <p className="text-center w-full font-medium text-xl mt-12">
            No course to enroll
          </p>
        )}
      </div>
      <BasicModal open={open} setOpen={setOpen}>
        <div>
          <h2 className="text-center font-bold">Confirm Enrollment</h2>
          <div className="flex items-center justify-between px-6 mt-5">
            <div className="flex w-[50%] justify-between px-4">
              <button
                className=" bg-blue-400 px-4 rounded-sm block"
                onClick={() => {}}
              >
                Submit assignment
              </button>
              <button
                className=" bg-red-400 px-4 rounded-sm block"
                onClick={() => {
                  router.push("/auth/login");
                  dispatch(logout());
                }}
              >
                logout
              </button>
            </div>
            <form action="" onSubmit={handleSubmit}>
              <button className="text-center bg-green-500 p-1 w-[6rem] font-semibold rounded-sm justify-center flex flex-nowrap gap-2">
                Enroll
                {loading && (
                  <Spinner
                    color="warning"
                    aria-label="Small  spinner example"
                    size="sm"
                  />
                )}
              </button>
            </form>
          </div>
        </div>
      </BasicModal>
    </div>
  );
}
