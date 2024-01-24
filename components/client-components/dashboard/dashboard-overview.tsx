"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetch } from "@/hooks/useSWR";
import { useUserStore } from "@/stores/user-store";

export default function DashboardOverview() {
  const user = useUserStore();
  const { data } = useFetch<number>(`/metrics/contracts/${user.id}`);
  return (
    <div>
      <Card>
        <CardContent>{data}</CardContent>
      </Card>
    </div>
  );
}
