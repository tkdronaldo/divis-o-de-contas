
export interface AccountType {
  id: string;
  name: string;
  icon: string;
  color: string;
  selected: boolean;
  value: number;
}

export interface Dependent {
  id: string;
  name: string;
}

export interface Payer {
  id: string;
  name: string;
  dependents: Dependent[];
}
