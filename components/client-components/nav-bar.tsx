"use client";
import { useUserStore } from "@/stores/user-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { useEffect } from "react";
import { destroyCookie } from "nookies";
import { ThemeToggle } from "./theme-toggle";
import { Separator } from "../ui/separator";

export default function Navbar() {
  useEffect(() => {
    useUserStore.persist.rehydrate();
  }, []);

  const user = useUserStore();

  async function logout() {
    destroyCookie(undefined, "imob-token");
  }

  return (
    <div className="flex px-14 h-14 items-center justify-end space-x-5 bg-secondary dark:bg-transparent border border-l-0">
      <ThemeToggle />
      <Separator orientation="vertical" className="h-8" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center cursor-pointer">
            <Label className="mr-4">Olá, {user.username}</Label>
            <Avatar>
              <AvatarImage
                src="https://github.com/lucasd09.png"
                alt="@lucasd09"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
