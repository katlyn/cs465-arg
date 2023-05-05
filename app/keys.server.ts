export const allowedKeys = {
  username: 524623670
}

export const secondaryKeys = {
  username: 794922099
}

export const names = {
  username: "Name"
}

export type AllowedUser = keyof typeof allowedKeys

export function getUser (num: number): AllowedUser|undefined {
  for (const user in allowedKeys) {
    if (allowedKeys[user as AllowedUser] === num) {
      return user as AllowedUser
    }
  }
}

export function getFirst (user: AllowedUser): number {
  return allowedKeys[user]
}
export function getSecond (user: AllowedUser): number {
  return allowedKeys[user] ^ secondaryKeys[user]
}

export function getThird (user: AllowedUser): number {
  const dayOfMonth = 24
  return (allowedKeys[user] >> dayOfMonth) * 12
}
