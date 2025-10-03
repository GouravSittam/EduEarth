import z from "zod";

const envSchema = z.object({
  PORT: z.string(),
  SERVER_BASE_URL: z.string().url(),
  CLIENT_BASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production"]),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(32, "ACCESS_TOKEN_SECRET must be at least 32 characters"),
  ACCESS_TOKEN_EXPIRY: z.string().min(1, "ACCESS_TOKEN_EXPIRY is required"),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, "REFRESH_TOKEN_SECRET must be at least 32 characters"),
  REFRESH_TOKEN_EXPIRY: z.string().min(1, "REFRESH_TOKEN_EXPIRY is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_REDIRECT_PATH: z.string().min(1, "GOOGLE_REDIRECT_PATH is required"),
  CLIENT_CALLBACK_PATH: z.string().min(1, "CLIENT_CALLBACK_PATH is required"),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
  S3_BUCKET: z.string().min(1, "S3_BUCKET is required"),
  GMAIL_USER: z.string().email("GMAIL_USER must be a valid email"),
  GMAIL_PASS: z.string().min(1, "GMAIL_PASS is required"),
  TEST_MAIL: z.string().email("TEST_MAIL must be a valid email").optional(),
  TEST_OTP: z
    .string()
    .min(6, "TEST_OTP must be at least 6 characters")
    .optional(),
});

const validateEnv = () => {
  return new Promise<void>((resolve, reject) => {
    const result = envSchema.safeParse(process.env);

    if (result.success) {
      console.log("\nEnvironment variables validated successfully\n");
      resolve();
    } else {
      console.error("\nEnvironment variable validation failed\n");
      reject();
      return;
    }
  });
};
export default validateEnv;
