import z from "zod";

export const PasswordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 8 caracteres")
  .max(128, "La contraseña no puede superar 128 caracteres");

// export const PasswordComplexSchema = PasswordSchema.refine(
//   (p) => /[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p),
//   { message: "La contraseña debe contener mayúscula, minúscula y número" }
// );

export const EmailSchema = z
  .string()
  .email("Formato de email inválido")
  .max(254, "Email demasiado largo");

export const UsernameSchema = z
  .string()
  .min(3, "El username debe tener al menos 3 caracteres")
  .max(30, "El username no puede superar 30 caracteres")
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    "El username solo puede contener letras, números, guiones bajos, puntos o guiones"
  );

export const LoginByEmailSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const LoginByUsernameSchema = z.object({
  username: UsernameSchema,
  password: PasswordSchema,
});

export type LoginByEmailDTO = z.infer<typeof LoginByEmailSchema>;
export type LoginByUsernameDTO = z.infer<typeof LoginByUsernameSchema>;

export const safeParseLogin = (credential: string, password: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(credential)) {
    return LoginByEmailSchema.safeParse({ email: credential, password });
  } else {
    return LoginByUsernameSchema.safeParse({ username: credential, password });
  }
};
