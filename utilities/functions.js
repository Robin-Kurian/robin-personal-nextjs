
import { toast } from "@/hooks/use-toast";

export const handleLoginResult = (result, onClose, setUser, router) => {
  if (result.error) {
    toast.error("Uh-oh! " + result.error);
  } else {
    setUser(result.user);
    toast.success("Login successful!");
    onClose();
    if (result.user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  }
};

const handleRegisterResult = (result, onClose, setUser, router) => {
  if (result.error) {
    toast.error("Uh- " + result.error);
  } else {
    setUser(result.user);
    toast.success("Registration successful!");
    if (result.user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
    onClose();
  }
};


const IS_DEVELOPMENT_MODE = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "local";
};

const AUTH = {
  HANDLE_LOGIN_RESULT: handleLoginResult,
  HANDLE_REGISTER_RESULT: handleRegisterResult,
};



const FUNCTIONS = {
  AUTH,
  IS_DEVELOPMENT_MODE,
};

export default FUNCTIONS;
