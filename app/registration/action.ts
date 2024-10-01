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
  console .log('Create User Result:', createUserResult)
    if(createUserResult.error) {
        console.error('Error creating user:', createUserResult.error.message);
        return { error: createUserResult.error.message };
    }


    const userId = createUserResult.data.user?.id;

    if (!userId) {
        console.error('User ID not returned from createUser.');
        return { error: 'User ID not returned from authentication system.' };
    }

    const userInsertResult = await supabase.from('users').insert({
        id: userId,
        full_name: data.full_name,
        date_of_birth: data.date_of_birth,
        phone_number: data.phone_number,
        email: data.email,
    }).select();

    console.log('Insert User Result:', userInsertResult);


    if(userInsertResult.error) {
        console.error('Error inserting user:', userInsertResult.error.message);
        return { error: userInsertResult.error.message };
    }

    return { message: 'Registration successful', user: createUserResult.data.user};
}