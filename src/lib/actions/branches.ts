"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteBranch(id: string | number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("branches")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/branches");
}
