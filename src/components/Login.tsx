"use client";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  username: string;
  password: string;
};

function Login() {
  const [usernamePlaceholder, setUsernamePlaceholder] = useState("");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("");
  const [error, setError] = useState("");
  const [isRequestSent, setIsRequestSent] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/panel";
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    setUsernamePlaceholder(errors.username?.message!);
  }, [errors.username]);

  useEffect(() => {
    setPasswordPlaceholder(errors.password?.message!);
  }, [errors.password]);

  const handleOnSubmit: SubmitHandler<Inputs> = (data) => {
    setIsRequestSent(true)
    signIn("credentials", {
      email: data.username,
      password: data.password,
      redirect: false,
      callbackUrl: callbackUrl,
    })
      .then((res) => {
        if (res?.error) {
          setError(res.error);
        } else {
          router.push(callbackUrl);
        }
      })
      .finally(() => setIsRequestSent(false));
  };

  const inputStyle = "px-4 py-2 rounded-sm";
  const errorInputStyle =
    "border-red-500 border-2 text-red-500 placeholder:text-red-400";

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="bg-primary flex flex-col flex-1 px-6 py-8 rounded-lg gap-4 drop-shadow-md shadow-md"
      >
        <h1 className="font-bold block mx-auto text-3xl uppercase text-white">
          Babi
        </h1>
        <input
          placeholder={`${
            usernamePlaceholder ? usernamePlaceholder : "Username"
          }`}
          type="text"
          className={`${inputStyle} mt-4 ${errors.username && errorInputStyle}`}
          {...register("username", {
            required: { value: true, message: "Username is required" },
          })}
        />
        <input
          placeholder={`${
            passwordPlaceholder ? passwordPlaceholder : "Password"
          }`}
          type="password"
          className={`${inputStyle} ${errors.password && errorInputStyle}`}
          {...register("password", {
            required: { value: true, message: "Password is required" },
          })}
        />
        <input
          type="submit"
          value={"Sign In"}
          className="bg-white hover:bg-yellow transition-colors duration-200 font-semibold text-primary px-4 py-2 rounded-sm"
        />
      </form>
      {
        error && <p className="text-center p-4 text-red-500">{error}</p>
      }
    </div>
  );
}

export default Login;
