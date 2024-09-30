"use server"

import { createSupabaseAdmin } from "@/lib/supabase";

export async function createRegisterUser(data: any) {
    const supabase = await createSupabaseAdmin();

    const createUserResult = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
            type: 'USER'
        }
    })
  console .log(createUserResult)
    if(createUserResult.error) {
        return { error: createUserResult.error.message };
    }


    const userId = createUserResult.data.user?.id;

    const userInsertResult = await supabase.from('users').insert({
        id: userId,
        full_name: data.full_name,
        date_of_birth: data.date_of_birth,
        phone_number: data.phone_number,
        email: data.email,
    }).select()


    if(userInsertResult.error) {
        return { error: userInsertResult.error.message };
    }

    return { message: 'Registration successful', user: createUserResult.data.user};
}