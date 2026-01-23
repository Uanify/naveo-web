"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteOrder(id: string | number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/orders");
}

export async function getOrder(id: string | number) {
    console.log(id)
}