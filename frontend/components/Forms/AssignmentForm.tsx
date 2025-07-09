"use client";
import {
  HelperText,
  Label,
  TextInput,
  Select,
  FileInput,
} from "flowbite-react";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/hooks";
import { createCourse } from "@/api/courseApi/page";
import { AxiosResponse } from "axios";
import { mutate } from "swr";
import { createAssignment } from "@/api/assignmentApi/page";

interface Inputs {
  file: any;
}
export const fileSchema = yup.object({
  file: yup
    .mixed()
    .required("File is required")
    .test("file-exists", "File must be provided", (value) => {
      return value && value[0] instanceof File;
    }),
});

export default function CourseForm({
  setOpen,
  courseId,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  courseId: number;
}) {
  const { user, token } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(fileSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("courseId", `${courseId}`);
    formData.append("studentId", user.id);
    formData.append("file", data.file[0]);

    const created = await createAssignment({
      data: formData,
      accessToken: token,
    });

    if (created) {
      setIsLoading(false);
      setOpen(false);
      if ("statusText" in created && created.statusText === "Created") {
        mutate(["course", user.id, token]);
        toast.success(created.data.message, { toastId: "created" });
      } else {
        toast.error(created?.data.message || "Something went wrong", {
          toastId: "error",
        });
      }
    }
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <div>
      <h3 className="text-center font-semibold mb-6">Submit Assignment</h3>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FileInput {...register("file")} id="file" name="file" />
          <HelperText color="failure">
            {errors.file && (
              <span color="failure" className="font-medium text-sm">
                {errors.file.message as string}
              </span>
            )}
          </HelperText>
        </div>
        <button
          disabled={isLoading}
          className={`${isLoading ? "bg-gray-400" : "bg-blue-600"} flex flex-nowrap gap-1 justify-center mt-4 w-full rounded-xl py-1.5`}
        >
          Submit
          {isLoading && (
            <Spinner
              color="warning"
              aria-label="Small  spinner example"
              size="sm"
            />
          )}
        </button>
      </form>
    </div>
  );
}
