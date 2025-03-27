import { create } from 'zustand';
import { cloneDeep } from 'lodash';

// Improved type definitions
type UserSession = {
  id?: string;
  user_id?: string;
  [key: string]: any;
};

type ProfileDetails = {
  id?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  [key: string]: any;
};

type SnackbarState = {
  open: boolean;
  severity: 'success' | 'error' | 'info' | 'warning';
  msg: string;
};

type RegistrationFormState = {
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  password: string;
};

type State = {
  userSession: UserSession;
  profileDetails: ProfileDetails;
  containers: Array<any>;
  snackbar: SnackbarState;
  registrationForm: RegistrationFormState;
};

// Initial state with proper typing
const initState: State = {
  userSession: {},
  profileDetails: {},
  containers: [],
  snackbar: {
    open: false,
    severity: 'info',
    msg: '',
  },
  registrationForm: {
    full_name: '',
    date_of_birth: '',
    phone_number: '',
    email: '',
    password: '',
  },
};

type Action = {
  openSnackbar: (severity: SnackbarState['severity'], msg: string) => void;
  closeSnackbar: () => void;

  setProfileDetailsAndSession: (session: UserSession, profileDetails: ProfileDetails) => void;

  setRegistrationFormField: (key: keyof RegistrationFormState, value: string) => void;
  resetRegistrationForm: () => void;

  setUserSession: (session: UserSession) => void;
  clearUserSession: () => void;

  setContainers: (containers: State['containers']) => void;
};

export const useStore = create<State & Action>((set) => ({
  ...cloneDeep(initState),

  openSnackbar: (severity, msg) => set((state) => ({
    ...state,
    snackbar: { open: true, severity, msg }
  })),
  
  closeSnackbar: () => set((state) => ({
    ...state,
    snackbar: { ...state.snackbar, open: false }
  })),

  setProfileDetailsAndSession: (userSession, profileDetails) => set(() => ({
    userSession,
    profileDetails
  })),

  setRegistrationFormField: (key, value) => set((state) => ({
    ...state,
    registrationForm: { ...state.registrationForm, [key]: value },
  })),
  
  resetRegistrationForm: () => set((state) => ({
    ...state,
    registrationForm: cloneDeep(initState.registrationForm)
  })),

  setUserSession: (session) => set((state) => ({
    ...state,
    userSession: session
  })),
  
  clearUserSession: () => set((state) => ({
    ...state,
    userSession: {}
  })),

  setContainers: (containers) => set((state) => ({
    ...state,
    containers
  })),
}));