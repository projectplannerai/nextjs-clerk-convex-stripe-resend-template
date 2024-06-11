import { FieldValues, UseFormRegister } from 'react-hook-form';

export type LoaderProps = {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
};

export type SpinnerProps = {
  noPadding?: boolean;
};

export type TypeSelectionFormProps = {
  register: UseFormRegister<FieldValues>;
  userType: 'owner' | 'student';
  setUserType: React.Dispatch<React.SetStateAction<'owner' | 'student'>>;
};

export type UserTypeCardProps = {
  value: string;
  title: string;
  text: string;
  register: UseFormRegister<FieldValues>;
  userType: 'owner' | 'student';
  setUserType: React.Dispatch<React.SetStateAction<'owner' | 'student'>>;
};
