import { ComponentType } from 'react';

export interface TabComponentProps {
  title: string;
  description: string;
}

interface ModalComponentProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export interface TabActionHeaderProps {
  title?: string;
  description?: string;
  buttonLabel: string;
  redirectPath: string;
  modalComponent?: ComponentType<ModalComponentProps>;
}

export interface SettingSubTabComponentProps {
  titile?: string;
}
