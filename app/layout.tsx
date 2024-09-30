

"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import Slide, {SlideProps } from '@mui/material/Slide';
import { useStore } from "@/store";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const theme = useTheme();
  const snackbar = useStore((state) => state.snackbar)
  const closeSnackbar = useStore((state) => state.closeSnackbar)


  return (
    <html lang="en">
      <body className={inter.className}>
      
      <ThemeProvider theme={theme}
      >  
       
         {children}
            <Snackbar 
                open={snackbar.open}
                TransitionComponent={SlideTransition} 
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                autoHideDuration={6000} 
                onClose={closeSnackbar}
            >
                <Alert
                    variant="filled"
                    onClose={closeSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.msg}
                </Alert>
            </Snackbar>
        </ThemeProvider>
        </body>
    </html>
  );
}
