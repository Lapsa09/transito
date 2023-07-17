//set expiration date at 8 hours from now
export const setExpiration = () => {
  const now = new Date()
  return now.setHours(now.getHours() + 8)
}
