"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

interface CreateDriverData {
    full_name: string;
    phone: string;
    vehicle_plate: string;
}

interface UpdateDriverData {
    full_name: string;
    phone: string;
    vehicle_plate: string;
}

export async function createDriver(data: CreateDriverData) {
    const supabase = await createClient(); // El cliente normal

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) throw new Error("No session available");

    console.log("DEBUG: Invocando con la llave forzada...");

    const { data: fnData, error: fnError } = await supabase.functions.invoke("create-driver", {
        body: data,
        headers: {
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (fnError) {
        // Si sigue dando 401, vamos a ver qué dice el cuerpo del error
        const errorDetail = await fnError.context?.json().catch(() => ({}));
        console.error("DEBUG ERROR GATEWAY:", errorDetail);
        throw new Error(`Error de Red: ${fnError.message}`);
    }
    if (!fnData?.ok) {
        console.error("DEBUG: La función respondió con error lógico:", fnData);

        const errorMessage = fnData?.error || "Unknown Error";
        const details = fnData?.details ? ` - Detalle: ${fnData.details}` : "";

        throw new Error(`Edge Function Error: ${errorMessage}${details}`);
    }

    console.log("DEBUG: Conductor creado exitosamente:", fnData);

    revalidatePath("/drivers");

    return {
        fleetCode: fnData.fleetCode as string,
        pin: fnData.pin as string,
        driverId: fnData.driverId as string,
    };
}

export async function updateDriver(id: string, data: UpdateDriverData) {
    const supabase = await createClient();

    const { error: profileError } = await supabase
        .from("profiles")
        .update({
            full_name: data.full_name,
            phone: data.phone,
        })
        .eq("id", id);

    if (profileError) throw new Error(profileError.message);

    const { error: detailsError } = await supabase
        .from("driver_details")
        .update({ vehicle_plate: data.vehicle_plate })
        .eq("profile_id", id);

    if (detailsError) throw new Error(detailsError.message);

    revalidatePath("/drivers");
}

export async function deleteDriver(id: string | number) {
    const adminAuth = createAdminClient();

    const { error } = await adminAuth.auth.admin.deleteUser(id.toString());

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/drivers");
}