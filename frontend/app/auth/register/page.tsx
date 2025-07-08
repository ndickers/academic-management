"use client";
import { HelperText, Label, TextInput, Select } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../formSchema";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Spinner } from "flowbite-react";
import { toast } from "react-toastify";

type Inputs = {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

export default function Component() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(registerSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      const newUser = {
        role: data.role.toUpperCase(),
        email: data.email,
        password: data.password,
      };
      const registerUser = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        newUser
      );
      if (registerUser.statusText === "Created") {
        toast.success(registerUser.data.message, { toastId: "register" });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message, { toastId: "error" });
      } else {
        toast.error("Unexpected error", { toastId: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex max-w-md flex-col gap-4 mx-auto pt-16">
      <h1 className="mx-auto text-4xl font-bold">Register</h1>
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
        <div className="max-w-md">
          <div className=" block">
            <Label htmlFor="role">Select Role</Label>
          </div>
          <Select id="role" {...register("role")}>
            <option>Student</option>
            <option>Lecturer</option>
          </Select>
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
        <div>
          <div className="mt-2 block">
            <Label htmlFor="username4">Confirm Password</Label>
          </div>
          <TextInput
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm Password"
            id="confirmPassword"
            color={errors.confirmPassword ? "failure" : "success"}
          />
          <HelperText color="failure">
            {errors.confirmPassword && (
              <span color="failure" className="font-medium text-sm">
                {errors.confirmPassword?.message}
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
