export const convertUserNameToEmail = (userName: string): string => {
  return userName.replace('-at-', '@');
};
