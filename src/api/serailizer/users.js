export const serializeUser = user => {
  console.log(user);
  const { id, name, email, isAdmin } = user;
  return { id, name, email, isAdmin };
};
