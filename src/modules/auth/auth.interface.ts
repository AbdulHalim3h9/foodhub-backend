export type IRegisterUser = {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
};

export type ILoginUser = {
  email: string;
  password: string;
};
