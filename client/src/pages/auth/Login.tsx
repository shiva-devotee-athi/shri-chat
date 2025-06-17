import PhoneInput, {
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "@/zod/auth.zod";
import { axios, baseURL } from "@/api/axios.config";
import { showErrorToast, showSuccessToast } from "@/utils/toast.util";
import { useState } from "react";
import parsePhoneNumberFromString from "libphonenumber-js";
import { useAppDispatch } from "@/store/hook";
import { login } from "@/store/slices/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      countryCode: 91,
    },
  });

  const handleCountryChange = (phone: any) => {
    const countryCode = getCountryCallingCode(phone);
    setValue("countryCode", Number(countryCode), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (values: LoginSchemaType) => {
    try {
      const parsedNumber = parsePhoneNumberFromString(values.mobile);
      const localNumber = parsedNumber
        ? parsedNumber.nationalNumber
        : values.mobile;

      const response = await axios.post(`${baseURL}auth/login`, {
        mobile: localNumber,
        password: values.password,
      });

      setIsLoading(false);
      if (response.data.status) {
        const { token } = response.data;
        dispatch(login({ token: token, role: "USER" }));

        navigate("/user/contact");
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Invalid email or password.");
    }
  };

  const notifyErrors = (type: keyof LoginSchemaType) =>
    errors[type] && (
      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
        {errors[type]?.message}
      </p>
    );

  return (
    <div className="pt-20">
      <div className="m-auto block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-sm mx-auto"
        >
          <div className="mb-5">
            <label
              htmlFor="mobile"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Phone number
            </label>
            <Controller
              name="mobile"
              control={control}
              rules={{
                validate: (value) => isValidPhoneNumber(value),
              }}
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  value={value}
                  onChange={onChange}
                  onCountryChange={handleCountryChange}
                  countryCallingCodeEditable={false}
                  className={`mobile-number-input bg-white border-gray-200 placeholder-gray-500 text-sm mt-1 block w-full rounded-lg border border-stroke py-2.5 pe-5.5 ps-6 text-dark focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light`}
                  placeholder="Enter phone number"
                  international
                  smartCaret
                  focusInputOnCountrySelection
                  defaultCountry="IN"
                  id="phone-input"
                />
              )}
            />
            {notifyErrors("mobile")}
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              {...register("password")}
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            />
            {notifyErrors("password")}
          </div>
          <div className="mb-5 flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isLoading ? "Loading..." : "Sign In"}
          </button>
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
