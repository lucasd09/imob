import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Owners() {
  const cookieStore = cookies();
  const token = cookieStore.get("imob-token");

  if (!token) {
    redirect("/login");
  }

  return <div>owners</div>;
}
