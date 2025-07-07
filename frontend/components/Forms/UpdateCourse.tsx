"use client";
import { HelperText, Label, TextInput, FileInput } from "flowbite-react";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Spinner } from "flowbite-react";
import { useAppSelector } from "@/lib/hooks";
import { updateCourse } from "@/api/courseApi/page";
import { toast } from "react-toastify";
import { mutate } from "swr";

export interface Inputs {
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
});

export default function CourseForm({ updateDetails, setOpen }: any) {
  const { user, token } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(courseShema),
  });
  const [isLoading, setIsLoading] = useState(false);
  if (updateDetails) {
    setValue("title", updateDetails.title);
    setValue("credits", updateDetails.credits);
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("credits", data.credits as Blob);
    if (data.syllabus[0]) {
      formData.append("syllabus", data.syllabus[0]);
    }

    const updated = await updateCourse({
      data: formData,
      accessToken: token,
      id: updateDetails.id,
    });

    if (updated) {
      setIsLoading(false);
      setOpen(false);
      if ("statusText" in updated && updated.statusText === "OK") {
        mutate(["course", user.id, token]);
        toast.success(updated.data.message, { toastId: "created" });
      } else {
        toast.error(updated?.data.message || "Something went wrong", {
          toastId: "error",
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h3 className="text-center font-semibold">Update Course</h3>
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
