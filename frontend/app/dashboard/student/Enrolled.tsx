import React, { useState } from "react";
import CourseCard from "../../../components/EnrollCard";
import useSWR, { mutate } from "swr";
import { getEnrolledStudentCourse } from "@/api/courseApi/page";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Spinner } from "flowbite-react";
import { logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import BasicModal from "../../../components/Modal";
import AssignmentForm from "../../../components/Forms/AssignmentForm";
import { dropCourse, enrollCourse, EnrollType } from "@/api/enrollment/page";
import { toast } from "react-toastify";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
export interface TypeCourse {
  title: string;
  credits: number;
  syllabus: string;
  id: number;
  enrollments: { status: string }[];
}

export default function Courses() {
  const [open, setOpen] = React.useState(false);
  const { user, token } = useAppSelector((state) => state.auth);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    ["enrolled", user.id, token],
    getEnrolledStudentCourse
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const dropped = await dropCourse({
      accessToken: token as string,
      studentId: user.id,
      courseId: courseId as number,
    });
    if (dropped) {
      setLoading(false);
      setOpen(false);
      if ("statusText" in dropped && dropped.statusText === "OK") {
        mutate(["enrolled", user.id, token]);
        mutate(["not-enrolled", user.id, token]);
        toast.success(dropped.data.message, { toastId: "dropped" });
      } else {
        toast.error(dropped?.data.message || "Something went wrong", {
          toastId: "error",
        });
      }
    }
    setLoading(false);
  };

  console.log({ data });

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
          data.map(
            ({ title, credits, syllabus, id, enrollments }: TypeCourse) => (
              <CourseCard
                key={id}
                title={title}
                syllabus={syllabus}
                id={id}
                status={enrollments[0].status}
                credits={credits}
                setCourseId={setCourseId}
                setOpen={setOpen}
                setOpenAssign={setOpenAssign}
              />
            )
          )
        ) : (
          <p className="text-center w-full font-medium text-xl mt-12">
            You have not enrolled to any course
          </p>
        )}
      </div>
      <BasicModal open={open} setOpen={setOpen}>
        <div>
          <h2 className="text-center font-bold">Drop Course</h2>
          <img
            className="mx-auto my-3"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEGElEQVR4nO1ZW4gcRRQtE43vRxQlokbxiS9EQVFUFkVwYNedOqctiCa4EHEh6If+5MfIBEVQUeLjQz/0R0FRUBQUBRGJQUEJhohLEERMND4Ivt2ZubWakuq9k0w2s5memZ7MtOyBgqbr3lvndlXfunXLmAUsoJgQ8nYBVpgiQ4ArBPg3Nm/tVaaICMYcIuQmT4bYhPwkvjNFgwAr1YGfYkufgZWmSAhjY0d5YHtKPklWC3lnOjPA92HVqqNNUSDAQ0r881CpLIpNyM90hh40RUC1XD5DyOnUkSS5vvHeW3uNkLsFqNbK5bPMsMOTr+lsvNyi7xXte9UMMzx5beOrV8kz5/ZPA6cL8HfqjLUjZhgRKpVFntys4bYyn5wA61VmS3BusRk2eHJSCX53oMgUnDvSA9+mP761d5lhQiiVjhPgR90r2qYjkiS3aQT7OZTLJ5hhgQBPdLp7C/CROv64GQbUnDtXyHqaTwFXZtWTJLlc8zBfd+6C/rLMAAHe0ZD6vOkQHnhBZ/JtM0jMACVdHn8E55bN7Q/OLQmjo0vT5tySFv3Lom60EW2ZQSBMTh7mgW0aqda2kvHAA43sNz63lCHXav+2aLPvxFuQvE9Jfh1KpcPb7Blx1ta3kokz5cmv1Jl7+058zuAnCvBLHLwOjM8nl8WRiLq1Zf1XfgvOndw34vsRJJ/TgT84oFxGR1T2PbX5bO6EWw6YJBcLOSPAP1IuX5qXI3XnLoqhOLULXJY78RbkPtQv93QG2cyOqPwzantTX4/FdeBWHejXYO1JeTsSRkeXCrkr/ffIJDfi+wwyMXGEB77R6HJ3Fp1OHYnw5D06xvZ4ZDZ5w5PrdICprPG+G0eCc4s9+YXq3W/yxLRzpwnwV7oDkzdn1evGkYgZ4EZdwtNV55abvOCBl5TQm53odetIhCff0hXwoskDHrhaj69St/b8g+VIzdpz0qya3O2tvc7kUC38VKf5kU71e3EkQoBHVX9zPEqbbiFJMtGoFgbnjj/YjoTx8WOF/EH17+hUf9aIc8d4cmejWthTpJtt67qxIUmyWvV3Rk6dGyAf7nVaY5jecx7pMkUPTdWZyKkj5Rp5tgC19EdrqhYOCn5vlVLq5HnZFck35qsWDgq+UaUkX8+kMEPekNdm1BR14s/6WC+2qs4tb9SUI8f26QGwtV21MCuE3NB00bOhZ3vQKAh8GUZGDp1X0JNrdOAdeSRseTsS4r0LuUNtrmmbQud1eRmvD2bIm2JrVdTuBgKs0A+zK3LeX4B8Sp34eNjv+gTYqFyf3Kejbu2FeszsqFo4KEijSjl75L5kbwf5brfVwkHBN6qUwPvpizp5i665PwNwqikIAnCKAL+n4djasejZVFM+VMwGTO0p7xe5CbBx0CtkAf9b/AcdAm2s+N4kaAAAAABJRU5ErkJggg=="
            alt="error--v1"
          ></img>
          <div className="flex items-center justify-between px-6 mt-5">
            <button
              onClick={() => {
                setOpen(false);
                setCourseId(null);
              }}
              className="bg-red-500 text-center w-[6rem] p-1 font-semibold rounded-sm"
            >
              Cancel
            </button>
            <form action="" onSubmit={handleSubmit}>
              <button className="text-center bg-green-500 p-1 w-[6rem] font-semibold rounded-sm justify-center flex flex-nowrap gap-2">
                Drop
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
      <BasicModal open={openAssign} setOpen={setOpenAssign}>
        <AssignmentForm courseId={courseId} setOpen={setOpenAssign} />
      </BasicModal>
    </div>
  );
}
