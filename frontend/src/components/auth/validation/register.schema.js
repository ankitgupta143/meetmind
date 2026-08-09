export const validateRegistration = ({ name, email, password, confirm, terms }) => Boolean(name && email && password && password === confirm && terms);
