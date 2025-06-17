import z from "zod";

const avatarSizeLimit = 5 * 1024 * 1024;
export const loginSchema = z.object({
  mobile: z.string({
    required_error: "Mobile Number field is required",
    invalid_type_error: "Value Must be a Number",
  }),
  countryCode: z.number({
    required_error: "Mobile Number field is required",
    invalid_type_error: "Value Must be a Number",
  }),
  password: z.string({
    required_error: "password is required",
    message: "Password must be 8 characters",
  }),
  // .min(8, { message: "Password should have minimum length of 8" })
  // .max(12, "Password is too long")
  // .regex(/^(?=.*[A-Z]).{8,}$/, {
  //   message:
  //     "Should Contain at least one uppercase letter and have a minimum length of 8 characters.",
  // }),
});

export const registerSchema = z.object({
  avatar: z
    .instanceof(File, { message: "Invalid message" })
    .refine((file) => file instanceof File, {
      message: "File is required",
    })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      { message: "Invalid image file type" }
    )
    .refine((file) => file.size <= avatarSizeLimit, {
      message: "File size should not exceed 5MB",
    }),
  displayName: z
    .string({
      required_error: "Display Name field is required",
      invalid_type_error: "Value Must be a string",
    })
    .min(1, "Display Name field is required"),
  username: z
    .string({ required_error: "username is required" })
    .min(6, { message: "Username must be at least 6 char longs" })
    .max(10, { message: "Username cannot exceed 20 characters" }),
  mobile: z.string({
    required_error: "Mobile Number field is required",
    invalid_type_error: "Value Must be a Number",
  }),
  countryCode: z.number({
    required_error: "Mobile Number field is required",
    invalid_type_error: "Value Must be a Number",
  }),
  password: z
    .string({
      required_error: "password is required",
      message: "Password must be 8 characters",
    })
    .min(8, { message: "Password should have minimum length of 8" })
    .max(12, "Password is too long")
    .regex(/^(?=.*[A-Z]).{8,}$/, {
      message:
        "Should Contain at least one uppercase letter and have a minimum length of 8 characters.",
    }),
});

export const verifyOTPSchema = z.object({
  otp: z.string({
    required_error: "Mobile Number field is required",
    invalid_type_error: "Value Must be a Number",
  }),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
