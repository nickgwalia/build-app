import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'
import { sendEthReward } from '../misc/ethtools'

export const Referrals = new Mongo.Collection('referrals')

if (Meteor.isServer) {
  Meteor.publish('referrals', function () {
    // Keep it simple and just publish all referrals data for now.
    // TODO: we should restrict what users can see.
    return Referrals.find({})
  })
}

Meteor.methods({
  async 'referrals.referralClaimed'(text) {
    console.log('Looking for referral code:', text)
    check(text, String)

    // Make sure the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized')
    }

    // Look up and update the referral object
    const referral = Referrals.findOne({code: text})
    if (!referral) {
      throw new Meteor.Error('bad-referral-code', 'Bad referral code')
    }

    console.log('Got referral:', referral)

    // User cannot enter their own referral code.
    if (referral.userId === Meteor.userId()) {
      throw new Meteor.Error('bad-referral-code', 'Nice try. You cannot enter your own referral code.')
    }

    // Credit the referring user
    // We only want to call this once, on the server!
    let txid
    if (Meteor.isServer) {
      // Look up the referring user's ETH address.
      const referringUser = Meteor.users.findOne(referral.userId)
      if (referringUser) {
        if (referringUser.ethereum && referringUser.ethereum.address) {
          const toAddress = referringUser.ethereum.address
          console.log(`Sending referral reward to address ${toAddress} of user ${referringUser._id} for claimed referral ${referral._id}`)
          try {
            txid = await sendEthReward(toAddress)
          } catch (error) {
            console.warn('Error attempting to send eth reward:', error)
          }
        } else {
          console.warn(`Found referring user ${referringUser._id} but found no eth address, not sending reward`)
        }
      } else {
        console.warn(`Found no user matching id ${referral.userId} for referral ${referral._id}, not sending reward`)
      }
    }

    // Get the referred user's name
    let name
    const facebookInfo = Meteor.user().services && Meteor.user().services.facebook
    const {first_name, last_name} = facebookInfo
    if (first_name && last_name) {
      name = first_name + ' ' + last_name.substr(0, 1).toUpperCase() + '.'
    }

    // Increment the number of times this code was used
    Referrals.update(referral, {
      $inc: {count: 1},
      $addToSet: {
        referred: {
          userId: Meteor.userId(),
          createdAt: new Date(),
          txid,
          name,
        }
      }
    })

    // Mark this user as having been referred
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "referrals.referredBy": text,
      }
    })
  }
})
