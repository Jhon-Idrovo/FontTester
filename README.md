# USER

We have acces to the user throuh the useUser hook. This hook uses the react context API.

# TODO

Review the error handling on PlanSelection

Sign out only happens when subscription is made
we need a way to update the state of the user's rol after subscription

if we update the user state - on reload it's lost since the \_app takes it from the token
If we delete the access token to force retrieving a new, updated one - the database record still may not be updated
