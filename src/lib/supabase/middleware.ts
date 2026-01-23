import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set({ name, value, ...options })
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    const isPublicContentRoute =
        pathname === "/" ||
        pathname.startsWith("/track") ||
        pathname.startsWith("/privacy-policy") ||
        pathname.startsWith("/terms-conditions");

    const isAuthRoute =
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password") ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/verify-account") ||
        pathname.startsWith("/verify-new-password");

    const isOnboardingRoute = pathname.startsWith("/onboarding");

    if (!user && !(isAuthRoute || isPublicContentRoute)) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("company_id")
            .eq("id", user.id)
            .single();

        const hasCompany = !!profile?.company_id;

        if (!hasCompany && !isOnboardingRoute && !(isAuthRoute || isPublicContentRoute)) {
            const url = request.nextUrl.clone();
            url.pathname = "/onboarding";
            return NextResponse.redirect(url);
        }

        if (hasCompany && isAuthRoute) {
            const url = request.nextUrl.clone();
            url.pathname = "/orders";
            return NextResponse.redirect(url);
        }

        if (hasCompany && isOnboardingRoute) {
            const url = request.nextUrl.clone();
            url.pathname = "/orders";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
