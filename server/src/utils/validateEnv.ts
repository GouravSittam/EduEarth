import z from "zod";

const envSchema = z.object({
  PORT: z.string(),
  SERVER_BASE_URL: z.string().url(),
  CLIENT_BASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production"]),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "SUPABASE_PUBLISHABLE_KEY is required"),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
  S3_BUCKET: z.string().min(1, "S3_BUCKET is required"),
  GMAIL_USER: z.string().email("GMAIL_USER must be a valid email"),
  GMAIL_PASS: z.string().min(1, "GMAIL_PASS is required"),
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
