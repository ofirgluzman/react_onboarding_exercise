import type { User } from './types';

/**
 * Filters users by name with prefix matching (case insensitive)
 * Matches first name, last name, or full name
 * @param users - Array of users to filter
 * @param name - Name term to filter by
 * @returns Filtered array of users
 */
export function filterUsersByName(users: User[], name: string): User[] {
  // If search term is empty, return all users
  if (!name.trim()) {
    return users;
  }

  const normalizedSearchTerm = name.toLowerCase().trim();

  return users.filter((user) => {
    const firstName = user.firstName.toLowerCase();
    const lastName = user.lastName.toLowerCase();
    const fullName = `${firstName} ${lastName}`;
    
    return (
      fullName.startsWith(normalizedSearchTerm) ||
      firstName.startsWith(normalizedSearchTerm) ||
      lastName.startsWith(normalizedSearchTerm)
    );
  });
}

/**
 * Gets an about description text for a user
 * @param user - User object to get description for
 * @returns Formatted about description string
 */
export function getAboutDescription(user: User): string {
  return `Hi, I'm ${user.firstName} ${user.lastName}. I'm ${user.age} years old and currently work as a ` +
    `${user.company.title} in the ${user.company.department} department at ${user.company.name}. ` +
    `I graduated from the ${user.university}. I live in ${user.address.city}, ${user.address.state}, ` +
    `and you can reach me at ${user.email} or ${user.phone}.`;
}
