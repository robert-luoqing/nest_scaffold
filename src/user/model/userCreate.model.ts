export interface UserCreateModel {
  username: string;
  password: string;
  role?: string;
  desc?: string;
  permission?: string;
}
