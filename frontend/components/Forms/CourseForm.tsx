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
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createCourse } from "@/api/courseApi/page";
import { AxiosResponse } from "axios";
import { mutate } from "swr";

interface Inputs {
  title: string;
  credits: number | Blob;
  syllabus: any;
}
export const courseShema = yup.object({
  title: yup.string().required("Title is required"),
  credits: yup
    .number()
    .typeError("Credits must be a number")
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .required("Credits is required"),
  syllabus: yup.mixed().required("Syllabus is required"),
});

export default function CourseForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user, token } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(courseShema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("credits", data.credits as Blob);
    formData.append("syllabus", data.syllabus[0]);
    formData.append("lecturerId", user.id);

    const created = await createCourse({
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
      <h3 className="text-center font-semibold">Create Course</h3>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="title">Title</Label>
          <TextInput
            id="title"
            {...register("title")}
            placeholder="Title"
            type="text"
            color={errors.title ? "failure" : "success"}
          />
          <HelperText color="failure">
            {errors.title && (
              <span color="failure" className="text-sm mb-1">
                {errors.title?.message}
              </span>
            )}
          </HelperText>
        </div>

        <div>
          <div className=" block">
            <Label htmlFor="credits">Credits</Label>
          </div>
          <TextInput
            id="credits"
            {...register("credits")}
            type="number"
            placeholder="Credits"
            color={errors.credits ? "failure" : "success"}
          />
          <HelperText color="failure">
            {errors.credits && (
              <span color="failure" className="font-medium text-sm">
                {errors.credits.message}
              </span>
            )}
          </HelperText>
        </div>
        <div>
          <div className="block">
            <Label htmlFor="syllabus">Syllabus</Label>
          </div>
          <FileInput {...register("syllabus")} id="syllabus" name="syllabus" />
          <HelperText color="failure">
            {errors.syllabus && (
              <span color="failure" className="font-medium text-sm">
                {errors.syllabus.message as string}
              </span>
            )}
          </HelperText>
        </div>

        <button
          disabled={isLoading}
          className={`${isLoading ? "bg-gray-400" : "bg-blue-600"} flex flex-nowrap gap-1 justify-center mt-4 w-full rounded-xl py-1.5`}
        >
          Add Course
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
