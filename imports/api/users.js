import { check } from 'meteor/check'
import { generateReferralCode } from '../misc/referrals'

// This code only runs on the server
if (Meteor.isServer) {
  Accounts.onCreateUser((options, user) => {
    console.log('New user created:', user)

    if (!(user.services && user.services.facebook))
      throw new Error('Expected Facebook login only')

    // Generate a referral code for this user
    user.referrals = { code: generateReferralCode(user) }

    // We still want the default hook's 'profile' behavior.
    if (options.profile) {
      user.profile = options.profile
    }

    // Don't forget to return the new user object at the end!
    return user
  })

  Meteor.publish('userData', function () {
    if (this.userId) {
      return Meteor.users.find({ _id: this.userId }, { fields: {
        referrals: 1,
        ethereum: 1,
      }})
    } else {
      this.ready()
    }
  })
}

Meteor.methods({
  async 'users.setEthAddress'(text) {
    check(text, String)

    // Make sure the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized')
    }

    Meteor.users.update(Meteor.userId(), {
      $set: {
        ethereum: { address: text },
      }
    })
  }
})
