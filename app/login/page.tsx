import FormLogin from "@/components/client-components/form-login";

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center text-center">
      <div className="flex-1 bg-primary h-screen"></div>
      <div className="text-left flex justify-center flex-1 ">
        <FormLogin />
      </div>
    </div>
  );
}
