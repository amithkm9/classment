import { create } from 'zustand';
import { cloneDeep } from 'lodash';

type State = {
  userSession: object;
  profileDetails: object;
  containers: Array<object>
  snackbar: {
    open: boolean;
    severity: any;
    msg: string;
  };

  registrationForm: {
    fullName: string;
    dob: string;
    phoneNumber: string;
    email: string;
    password: string;
  };
};

const initState: State = {
  userSession: {},
  profileDetails: {},
  snackbar: {
    open: false,
    severity: '',
    msg: '',
  },

  registrationForm: {
    fullName: '',
    dob: '',
    phoneNumber: '',
    email: '',
    password: '',
  },
};

type Action = {
  openSnackbar: (severity: string, msg: string) => void;
  closeSnackbar: () => void;

  setProfileDetailsAndSession: (session: State['userSession'], profileDetails: State['profileDetails']) => void

  setRegistrationFormField: (key: string, value: string) => void;
  resetRegistrationForm: () => void;

  setUserSession: (session: State['userSession']) => void;
  clearUserSession: () => void;

  setContainers: (containers: State['containers']) => void
};

export const useStore = create<State & Action>((set) => ({
  ...cloneDeep(initState),

  openSnackbar: (severity, msg) => set((state) => ({...state, snackbar: { open: true, severity, msg } })),
  closeSnackbar: () => set((state) => ({snackbar: { ...state.snackbar, open: false}})),

  setProfileDetailsAndSession: (userSession, profileDetails) => set(() => ({userSession, profileDetails})),

  setRegistrationFormField: (key, value) => set((state) => ({
    registrationForm: { ...state.registrationForm, [key]: value },
  })),
  resetRegistrationForm: () => set(() => cloneDeep(initState)), // I modify this check it later

  setUserSession: (session) => set(() => ({ userSession: session})),
  clearUserSession: () => set(() => ({ userSession: {} })),

  setContainers: (containers) => set(() => ({containers})),
}));