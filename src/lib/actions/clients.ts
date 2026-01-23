"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteClient(id: string | number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/clients");
}
