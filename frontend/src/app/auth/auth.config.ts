import { StepperConfig, UserAuthData } from './auth.model';

export enum STEPPER_STEPS {
  FirstStep = 'firstStep',
  SecondStep = 'secondStep',
  ThirdStep = 'thirdStep'
}

export const INITIAL_STEPPER_CONFIG: StepperConfig = {
  activeStep: STEPPER_STEPS.FirstStep,
  isSecondStepDisabled: true,
  isThirdStepDisabled: true
};

export enum NEXT_STEP_BUTTON_CONFIG {
  Continue = 'Continue',
  CreateAccount = 'Create account'
}

export enum PASSWORDS_TO_COMPARE {
  NewPassword = 'newPassword',
  ConfirmNewPassword = 'confirmNewPassword',
  Password = 'password',
  RepeatPassword = 'repeatPassword'
}

export const DRAFT_FORM_INITIAL_VALUE: UserAuthData = {
  email: '',
  password: '',
  givenName: '',
  familyName: '',
  avatar: '',
  socialMedia: {
    linkedin: '',
    instagram: '',
    facebook: '',
    skype: '',
    telegram: ''
  }
};

export enum COGNITO_ERROR_MESSAGES {
  IncorrectUser = 'User does not exist.',
  IncorrectPassword = 'Incorrect username or password.'
}
