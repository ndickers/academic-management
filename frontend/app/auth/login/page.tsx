"use client";
import { HelperText, Label, TextInput, Select } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../formSchema";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import { userLogin } from "../../../lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks";

const ADMIN = "ADMIN";
const LECTURER = "LECTURER";
const STUDENT = "STUDENT";
type Inputs = {
  email: string;
  password: string;
};

export default function Component() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(loginSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { user, error } = useAppSelector((state) => state.auth);

  const router = useRouter();
  useEffect(() => {
    if (user) {
      if (user.role === ADMIN) {
        router.push("/dashboard/admin");
      } else if (user.role === LECTURER) {
        router.push("/dashboard/lecturer");
      } else if (user.role === STUDENT) {
        router.push("/dashboard/student");
      } else {
        router.push("/auth/login");
      }
    } else {
      router.push("/auth/login");
    }
  }, [error, user]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    dispatch(userLogin(data));
    if (user) {
      toast.success("Login successfull", { toastId: "login" });
    } else if (error) {
      toast.error(error as string, { toastId: "login" });
    }
  };

  return (
    <div className="flex max-w-md flex-col gap-4 mx-auto pt-16">
      <h1 className="mx-auto text-4xl font-bold">Sign in</h1>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="email">Email</Label>
          <TextInput
            id="email"
            {...register("email")}
            placeholder="Email"
            color={errors.email ? "failure" : "success"}
          />
          <HelperText color="failure">
            {errors.email && (
              <span color="failure" className="text-sm mb-1">
                {errors.email?.message}
              </span>
            )}
          </HelperText>
        </div>

        <div>
          <div className="mt-2 block">
            <Label htmlFor="password">Password</Label>
          </div>
          <TextInput
            id="password"
            {...register("password")}
            type="password"
            placeholder="Password"
            color={errors.password ? "failure" : "success"}
          />
          <HelperText color="failure">
            {errors.password && (
              <span color="failure" className="font-medium text-sm">
                {errors.password?.message}
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
