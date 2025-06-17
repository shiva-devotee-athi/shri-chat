import { useRef, useState } from "react";
import PhoneInput, {
  isValidPhoneNumber,
  getCountryCallingCode,
} from "react-phone-number-input";
import parsePhoneNumberFromString from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { registerSchema, RegisterSchemaType } from "@/zod/auth.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showErrorToast, showSuccessToast } from "@/utils/toast.util";
import Cropper from "react-cropper";
import "react-cropper/node_modules/cropperjs/dist/cropper.css";
import { setImage, setCropped } from "@/store/slices/avatarSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import AnimatedModal from "@/components/Modals/AnimatedModal";
import { Camera, Crop } from "lucide-react";
import { motion } from "framer-motion";
import { baseURL } from "@/api/axios.config";
import axios from "axios";

const Register = () => {
  const dispatch = useAppDispatch();
  const cropperRef = useRef<HTMLImageElement>(null);
  const [cropImgModal, setCropImgModal] = useState(false);
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState<
    (RegisterSchemaType & { otp: string }) | null
  >(null);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isVerifyRegister, setIsVerifyRegister] = useState<string | null>(null);
  const { image, cropped } = useAppSelector((state) => state.avatar);
  const handleCloseCropModal = () => {
    setCropImgModal(false);
  };
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      countryCode: 91,
    },
  });

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // Allow only one digit

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      showErrorToast("File Error");
      return;
    }
    setValue("avatar", file);
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(setImage(reader.result as string));
    };
    setCropImgModal(true);
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (!cropperRef.current) {
      return;
    }
    const { cropper } = cropperRef.current as any;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
      });
      const dataUrl = croppedCanvas.toDataURL();
      dispatch(setCropped(dataUrl));
      handleCloseCropModal();
    }
  };

  const handleCountryChange = (phone: any) => {
    const countryCode = getCountryCallingCode(phone);
    setValue("countryCode", Number(countryCode), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (values: RegisterSchemaType) => {
    const parsedNumber = parsePhoneNumberFromString(values.mobile);
    const localNumber = parsedNumber
      ? parsedNumber.nationalNumber
      : values.mobile;
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("displayName", values.displayName);
    formData.append("countryCode", values.countryCode.toString());
    formData.append("mobile", localNumber);
    formData.append("password", values.password);
    formData.append("avatar", values.avatar);
    formData.append("roleName", "USER");

    // /assets/avatar/avatar-3.jpg
    const response = await axios.post(`${baseURL}auth/register`, formData);
    if (response.data) {
      showSuccessToast(response.data.message);
      setIsVerifyRegister(response.data.otp);
      setRegisterData({
        ...values,
        mobile: localNumber,
        otp: response.data.otp,
      });
    } else {
      showErrorToast(response.data.message);
    }
  };

  const handleOtpSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      showErrorToast("Please enter the full 4-digit OTP");
      return;
    }

    if (!registerData) {
      showErrorToast("Register data Empty");
      return;
    }

    const response = await axios.post(`${baseURL}auth/verify-otp`, {
      otp: enteredOtp,
      mobile: registerData.mobile, // assume you stored it in state
      countryCode: registerData.countryCode.toString(),
      roleName: "USER",
    });

    if (response.data.status) {
      showSuccessToast(response.data.message);
      navigate("/");
    } else {
      showErrorToast(response.data.message);
    }
  };

  const notifyErrors = (type: keyof RegisterSchemaType) =>
    errors[type] && (
      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
        {errors[type]?.message}
      </p>
    );

  return (
    <div className="pt-20">
      {!isVerifyRegister ? (
        <div className="m-auto block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-sm mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative mx-auto my-6 flex justify-center items-center w-full max-w-[120px]">
                <div className="absolute bottom-1.5 right-0.5 z-10">
                  <input
                    type="file"
                    id="imageUpload"
                    onChange={handleFileChange}
                    accept=".png, .jpg, .jpeg"
                    className="hidden"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="inline-block w-[30px] h-[30px] rounded-full bg-[#ffd77f] border-2 border-[#f6b21b] shadow-md cursor-pointer transition-all duration-200 ease-in-out dark:border-yellow-800 dark:bg-yellow-600 hover:bg-[#f6b21b] hover:border-[#f6b21b]"
                  >
                    <Camera className="flex items-center justify-center w-full h-full p-1" />
                  </label>
                </div>
                <div className="relative w-[106px] h-[106px] overflow-hidden rounded-full border-6 border-[#f6b21b] dark:border-yellow-800 shadow-md">
                  <div className="w-full h-full rounded-full bg-cover bg-no-repeat bg-center">
                    {!cropped ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#fff"
                        className="p-4 bg-neutral-300 fill-white dark:bg-neutral-800"
                        viewBox="0 0 285.5 285.5"
                      >
                        <g>
                          <path d="M79.999,62.75c0,34.601,28.149,62.75,62.751,62.75s62.751-28.149,62.751-62.75S177.352,0,142.75,0   S79.999,28.149,79.999,62.75z" />
                          <path d="M42.75,285.5h200c8.284,0,15-6.716,15-15c0-63.411-51.589-115-115-115s-115,51.589-115,115   C27.75,278.784,34.466,285.5,42.75,285.5z" />
                        </g>
                      </svg>
                    ) : (
                      <img src={cropped} alt="Cropped" className="" />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center">{notifyErrors("avatar")}</div>
            </motion.div>

            <div className="mb-5">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                User Name
              </label>
              <input
                type="text"
                {...register("username")}
                placeholder="@esrme06s"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {notifyErrors("username")}
            </div>
            <div className="mb-5">
              <label
                htmlFor="displayName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Display Name
              </label>
              <input
                type="text"
                autoComplete="name"
                {...register("displayName")}
                placeholder="Enter your display name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {notifyErrors("displayName")}
            </div>
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
                placeholder="Enter your password"
                {...register("password")}
                className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
              />
              {notifyErrors("password")}
            </div>

            <button
              type="submit"
              className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Sign Up
            </button>
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      ) : (
        <div className="relative bg-white dark:bg-zinc-700 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-12">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>We have sent a code to your here..</p>
              </div>
              <p className="text-3xl">{registerData?.otp}</p>
            </div>
            <div className="max-w-sm mx-auto">
              <div className="flex flex-row items-center gap-4 justify-between mx-auto w-full max-w-xs">
                {otp.map((digit, idx) => (
                  <div className="w-16 h-16" key={idx}>
                    <input
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, idx)}
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-zinc-900 text-lg bg-white dark:bg-zinc-800 focus:bg-zinc-800 focus:ring-1 ring-blue-700"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleOtpSubmit}
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base px-5 py-3 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Verify
            </button>
          </div>
        </div>
      )}

      <AnimatedModal
        isOpen={cropImgModal}
        onClose={true}
        closeModal={() => handleCloseCropModal()}
        size="lg"
        position="center"
        scrollable={true}
        zIndex={1000}
      >
        <div className="p-4 md:p-5">
          {/* Icon */}
          <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center mb-4">
            <Crop className="w-4 h-4 text-gray-700" />
          </div>

          {/* Title & Description */}
          <h2 className="text-lg font-semibold mb-1">Update Contact</h2>
          <p className="text-sm text-gray-500 mb-4">
            Your new project has been created. Invite colleagues to collaborate
            on this project.
          </p>
          {image && (
            <div className="space-y-3 mb-4">
              <Cropper
                src={image}
                style={{ height: 300, width: "100%" }}
                aspectRatio={1}
                guides={false}
                ref={cropperRef}
                viewMode={1}
                background={true}
              />
              <div className="flex flex-col lg:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseCropModal}
                  className="flex-1 px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-gray-200 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCrop}
                  className="flex-1 px-4 py-2 text-sm rounded-md text-white bg-rose-600 hover:bg-rose-700"
                >
                  Crop
                </button>
              </div>
            </div>
          )}
        </div>
      </AnimatedModal>
    </div>
  );
};

export default Register;
