"use client";
import React, { useEffect } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { Budgets } from "db/schema";
import { db } from "db/index";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress) {
      checkUserBudgets();
    }
  }, [user]);

  const checkUserBudgets = async () => {
    try {
      console.log("Fetching budgets for:", user.primaryEmailAddress?.emailAddress);

      const result = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.createdBy, user.primaryEmailAddress?.emailAddress));

      console.log("Budget Query Result:", result); // Debugging

      if (Array.isArray(result)) {
        console.log("Budget count:", result.length);
      }

      // ✅ Redirect only if no budgets exist
      if (Array.isArray(result) && result.length === 0) {
        console.log("No budgets found. Redirecting to /dashboard/budgets...");
        router.replace("/dashboard/budgets");
      } else {
        console.log("Budgets found. No redirect.");
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  return (
    <div>
      <div className="fixed md:w-64 hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-64">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
