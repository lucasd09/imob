"use client";
import { getRenters } from "@/services/axios-requests";
import { useUserStore } from "@/stores/user-store";
import { Button } from "../ui/button";

export default function RentersOverview() {
  const user = useUserStore();

  async function fetchRenters() {
    const renters = await getRenters(user.id);

    console.log(renters);
  }

  return (
    <div>
      <Button onClick={fetchRenters}>testar</Button>
    </div>
  );
}
