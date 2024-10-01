"use client";

import React, { useTransition } from "react";
import { TextField, Card, Typography, } from "@mui/material";
import Link from "next/link";
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import { useStore } from "@/store";
import { createRegisterUser } from "@/app/registration/action";
import Image from "next/image"



export default function RegistrationPage() {
  const [isRegistrationPending, startRegistrationTransaction] = useTransition();

  const registrationForm = useStore((state: any) => state.registrationForm);
  const openSnackbar = useStore((state: any) => state.openSnackbar);
  const setRegistrationFormField = useStore((state: any) => state.setRegistrationFormField);
  const addUserToStore = useStore((state: any) => state.addUserToStore);

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    console.log("Form submitted", {
      full_name: registrationForm.full_name,
        date_of_birth: registrationForm.date_of_birth,
        phone_number: registrationForm.phone_number,
        email: registrationForm.email,
        password: registrationForm.password
    });
    // Call your server here or use the store to update the state

    startRegistrationTransaction(async () => {
      const regResult: any = await createRegisterUser({
        full_name: registrationForm.full_name,
        date_of_birth: registrationForm.date_of_birth,
        phone_number: registrationForm.phone_number,
        email: registrationForm.email,
        password: registrationForm.password
      });

      if (regResult.error) openSnackbar('error', regResult.error.message);
      else {
        addUserToStore(regResult.data);
        openSnackbar('success', 'Registration successful!');
      }
    });
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md mx-4">
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <div className="text-center mb-6">

            <div className="flex justify-center m-4">
              <Image src="/logo.png" alt="" width={150} height={150} />
            </div>

            <Typography variant="h6" className="text-gray-700 font-semibold">Create your account</Typography>
          </div>
          <form onSubmit={handleSubmitForm}>
            <div className="space-y-4">
              <TextField
                required
                fullWidth
                label="Full Name"
                size="small"
                name="full_name"
                variant="outlined"
                className="border rounded-md"
                value={registrationForm.full_name}
                onChange={(e) => setRegistrationFormField("full_name", e.target.value)}
              />
               <LocalizationProvider dateAdapter={AdapterDayjs}>
               <DemoContainer components={['DatePicker']}>
               <DatePicker
                  label="Date of Birth"
                  value={registrationForm.date_of_birth ? dayjs(registrationForm.date_of_birth) : null}
                  onChange={(newDate: Dayjs | null) => {
                    if (newDate) {
                      setRegistrationFormField('date_of_birth'); 
                    } else {
                      setRegistrationFormField('date_of_birth', ''); 
                    }
                  }}
                  renderInput={(params) => <TextField {...params}  />}
                  className="w-full"
                />
                </DemoContainer>
                </LocalizationProvider>
              <TextField
                required
                fullWidth
                label="Phone Number"
                size="small"
                name="phone_number"
                variant="outlined"
                className="border rounded-md"
                value={registrationForm.phone_number}
                onChange={(e) => setRegistrationFormField("phone_number", e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Email Id"
                size="small"
                name="email"
                variant="outlined"
                className="border rounded-md"
                value={registrationForm.email}
                onChange={(e) => setRegistrationFormField("email", e.target.value)}
              />
              <TextField
                required
                fullWidth
                type="password"
                label="Enter Password"
                size="small"
                name="password"
                variant="outlined"
                className="border rounded-md"
                value={registrationForm.Password}
                onChange={(e) => setRegistrationFormField("Password", e.target.value)}
              />
              <div>
                <input
                type='checkbox'
                name="termsAndConditions"
                value="termsAndConditions"
                className="w-3 h-3"
                />
                <label className="ml-2">I agree to the <span className="text-blue-500"> Terms and Conditions</span></label>
              </div>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                loading={isRegistrationPending}
                loadingPosition="end"
                className="bg-blue-500 text-white py-2"
              >
                Register
              </LoadingButton>
             
              {/* <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <span className="text-blue-500">
                    <Link href="/login">Login</Link>
                  </span>
                </p>
              </div> */}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
