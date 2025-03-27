"use client";

import React, { useTransition, useState } from "react";
import { TextField, Card, Typography, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import Link from "next/link";
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import { useStore } from "@/store";
import { createRegisterUser } from "@/app/registration/action";
import Image from "next/image";

// Interface for form validation errors
interface FormErrors {
  full_name?: string;
  date_of_birth?: string;
  phone_number?: string;
  email?: string;
  password?: string;
  terms?: string;
}

export default function RegistrationPage() {
  const [isRegistrationPending, startRegistrationTransaction] = useTransition();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const registrationForm = useStore((state) => state.registrationForm);
  const openSnackbar = useStore((state) => state.openSnackbar);
  const setRegistrationFormField = useStore((state) => state.setRegistrationFormField);
  const setUserSession = useStore((state) => state.setUserSession); // Use setUserSession instead of addUserToStore

  // Validate form fields
  const validateForm = () => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!registrationForm.full_name) {
      errors.full_name = "Full name is required";
      isValid = false;
    }

    if (!registrationForm.date_of_birth) {
      errors.date_of_birth = "Date of birth is required";
      isValid = false;
    }

    if (!registrationForm.phone_number) {
      errors.phone_number = "Phone number is required";
      isValid = false;
    } else if (!/^[0-9+\-\s]+$/.test(registrationForm.phone_number)) {
      errors.phone_number = "Please enter a valid phone number";
      isValid = false;
    }

    if (!registrationForm.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(registrationForm.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!registrationForm.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (registrationForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!termsAccepted) {
      errors.terms = "You must accept the terms and conditions";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      openSnackbar('error', 'Please fix the errors in the form');
      return;
    }

    console.log("Form submitted", {
      full_name: registrationForm.full_name,
      date_of_birth: registrationForm.date_of_birth,
      phone_number: registrationForm.phone_number,
      email: registrationForm.email,
      password: registrationForm.password
    });

    startRegistrationTransaction(async () => {
      try {
        const regResult = await createRegisterUser({
          full_name: registrationForm.full_name,
          date_of_birth: registrationForm.date_of_birth,
          phone_number: registrationForm.phone_number,
          email: registrationForm.email,
          password: registrationForm.password
        });

        if (regResult.error) {
          openSnackbar('error', typeof regResult.error === 'string' ? regResult.error : regResult.error.message || 'Registration failed');
        } else {
          setUserSession(regResult.user || regResult); // Store user data based on actual structure
          openSnackbar('success', 'Registration successful!');
        }
      } catch (error) {
        console.error('Registration error:', error);
        openSnackbar('error', 'An unexpected error occurred during registration');
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md mx-4">
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <div className="text-center mb-6">
            <div className="flex justify-center m-4">
              <Image src="/logo.png" alt="Logo" width={150} height={150} />
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
                error={!!formErrors.full_name}
                helperText={formErrors.full_name}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Date of Birth"
                    value={registrationForm.date_of_birth ? dayjs(registrationForm.date_of_birth) : null}
                    onChange={(newDate: Dayjs | null) => {
                      if (newDate) {
                        setRegistrationFormField('date_of_birth', newDate.format('YYYY-MM-DD'));
                      } else {
                        setRegistrationFormField('date_of_birth', '');
                      }
                    }}
                    className="w-full"
                    slotProps={{
                      textField: {
                        error: !!formErrors.date_of_birth,
                        helperText: formErrors.date_of_birth,
                        size: "small"
                      }
                    }}
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
                error={!!formErrors.phone_number}
                helperText={formErrors.phone_number}
              />
              <TextField
                required
                fullWidth
                label="Email"
                size="small"
                name="email"
                variant="outlined"
                className="border rounded-md"
                value={registrationForm.email}
                onChange={(e) => setRegistrationFormField("email", e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <TextField
                required
                fullWidth
                type="password"
                label="Password"
                size="small"
                name="password"
                variant="outlined"
                className="border rounded-md"
                value={registrationForm.password}
                onChange={(e) => setRegistrationFormField("password", e.target.value)}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      size="small"
                    />
                  }
                  label={<span className="text-sm">I agree to the <span className="text-blue-500 cursor-pointer">Terms and Conditions</span></span>}
                />
                {formErrors.terms && (
                  <FormHelperText error>{formErrors.terms}</FormHelperText>
                )}
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
              
              <div className="text-center mt-4">
                <Typography variant="body2" className="text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-500 hover:underline">
                    Login
                  </Link>
                </Typography>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}