"use server"

import { createClient } from "@supabase/supabase-js"



export async function createSupabaseAdmin() {
	return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        },
    });
}

