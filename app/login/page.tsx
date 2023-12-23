import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center text-center">
      <div className="flex-1 bg-primary h-screen"></div>
      <div className="text-left flex justify-center flex-1 ">
        <div className="flex flex-col w-96">
          <div className="">
            <Label htmlFor="email">Email</Label>
            <Input id="email" />
          </div>
          <div className="mt-6">
            <Label htmlFor="password">Senha</Label>
            <Input id="email" />
          </div>
          <Button className="mt-6">Login</Button>
        </div>
      </div>
    </div>
  );
}
