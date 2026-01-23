import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}

function generatePin(length = 8) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return result;
}

function makeSyntheticEmail(fleetCode: string) {
    const clean = fleetCode.toLowerCase().replace(/[^a-z0-9]/g, "");
    const random = crypto.getRandomValues(new Uint8Array(6));
    const suffix = Array.from(random).map((b) => b.toString(16).padStart(2, "0")).join("");
    return `driver_${suffix}@${clean}.naveo`;
}

serve(async (req) => {
    // Manejo de CORS
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        if (req.method !== "POST") {
            return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
        }

        // --- LÓGICA DE LLAVES (PUENTE DE EMERGENCIA) ---
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

        // Si MY_ACTUAL_SERVICE_KEY existe, la usamos. Si no, usamos la de reserva.
        const serviceKey = Deno.env.get("MY_ACTUAL_SERVICE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        console.log("--- DEBUG DE LLAVES ---");
        console.log("URL:", supabaseUrl);
        console.log("RESERVED_KEY (últimos 4):", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.slice(-4));
        console.log("MY_ACTUAL_KEY (últimos 4):", Deno.env.get("MY_ACTUAL_SERVICE_KEY")?.slice(-4));
        console.log("Usando llave que termina en:", serviceKey.slice(-4));

        if (!supabaseUrl || !serviceKey) {
            return jsonResponse({ ok: false, error: "Missing server env vars" }, 500);
        }

        // Cliente Admin con la llave forzada
        const admin = createClient(supabaseUrl, serviceKey);

        // Validar Bearer token
        const authHeader = req.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "").trim();
        if (!token) return jsonResponse({ ok: false, error: "Missing Authorization" }, 401);

        // Validamos el usuario
        const { data: userData, error: userError } = await admin.auth.getUser(token);

        if (userError || !userData.user) {
            console.error("CRITICAL AUTH ERROR:", userError?.message);
            return jsonResponse({
                ok: false,
                error: "Invalid token",
                details: userError?.message,
                usedKeySuffix: serviceKey.slice(-4) // Para saber qué llave falló
            }, 401);
        }

        // Lectura del Body
        const body = await req.json().catch(() => null);
        if (!body) return jsonResponse({ ok: false, error: "Invalid JSON body" }, 400);

        const fullName = String(body.full_name ?? "").trim();
        const phone = String(body.phone ?? "").trim();
        const vehiclePlate = String(body.vehicle_plate ?? "").trim();

        if (!fullName) return jsonResponse({ ok: false, error: "full_name is required" }, 400);

        // 1. Obtener contexto de empresa
        const { data: companyData, error: companyError } = await admin
            .from("profiles")
            .select(`company_id, companies ( fleet_code )`)
            .eq("id", userData.user.id)
            .single();

        if (companyError || !companyData?.company_id) {
            console.error("Company resolution error:", companyError);
            return jsonResponse({ ok: false, error: "Unable to resolve company context" }, 400);
        }

        const companyId = companyData.company_id;
        const fleetCode = (companyData as any).companies.fleet_code;

        // 2. Generar PIN único
        let pin = "";
        for (let i = 0; i < 10; i++) {
            const candidate = generatePin(8);
            const { data: exists } = await admin
                .from("driver_details")
                .select("pin")
                .eq("pin", candidate)
                .limit(1);

            if (!exists || exists.length === 0) {
                pin = candidate;
                break;
            }
        }

        if (!pin) throw new Error("Could not generate a unique PIN");

        // 3. Crear Usuario Sintético
        const syntheticEmail = makeSyntheticEmail(fleetCode);
        const { data: created, error: createAuthError } = await admin.auth.admin.createUser({
            email: syntheticEmail,
            password: pin,
            email_confirm: true,
            user_metadata: { role: "driver", full_name: fullName },
        });

        if (createAuthError || !created.user) {
            throw new Error(`Auth creation failed: ${createAuthError?.message}`);
        }

        const driverId = created.user.id;

        try {
            // 4. Actualizar Tablas (Profiles y Driver Details)
            const { error: profileError } = await admin
                .from("profiles")
                .update({
                    company_id: companyId,
                    full_name: fullName,
                    phone: phone || null,
                    role: "driver",
                    is_active: true,
                })
                .eq("id", driverId);

            if (profileError) throw new Error(profileError.message);

            const { error: detailsError } = await admin
                .from("driver_details")
                .upsert({
                    profile_id: driverId,
                    vehicle_plate: vehiclePlate || null,
                    pin,
                });

            if (detailsError) throw new Error(detailsError.message);

            return jsonResponse({ ok: true, driverId, fleetCode, pin });

        } catch (dbErr: any) {
            // Rollback
            await admin.auth.admin.deleteUser(driverId);
            throw dbErr;
        }

    } catch (err: any) {
        console.error("Global catch:", err.message);
        return jsonResponse({ ok: false, error: err.message || "Unknown error" }, 500);
    }
});