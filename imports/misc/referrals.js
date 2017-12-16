import { Referrals } from '../api/referrals'

/**
 * Generate a unique referral code for a user based on their Facebook data.
 * @param user
 */
export function generateReferralCode(user) {
  console.log('Generating unique referral code for user', user)

  if (!(user.services && user.services.facebook))
    throw new Error('Facebook data missing from user object')

  const { first_name, last_name } = user.services.facebook
  if (!(first_name && last_name))
    throw new Error('First or last name data missing in Facebook')

  // Generate a unique referral code for this user.
  for (let i = 0; i < 1000; i++) {
    const code = `${first_name.toLowerCase()}${i}`
    const someoneTookIt = Referrals.findOne({code})
    if (!someoneTookIt) {
      // Record it, register to this user
      Referrals.insert({
        code,
        userId: user._id,
        count: 0,
        referred: [],
      })
      return code
    }
  }

  throw new Error('Unable to generate unique referral code for user')
}
