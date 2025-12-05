import { User } from "firebase/auth";
export type AuthContextValues = {
  userAuth: User | null;
  loading: boolean;
};
export type Prop = {
  children: React.ReactNode;
};

export type addUserValues = {
  name: string;
  email: string;
};
