# USER

We have acces to the user throuh the useUser hook. This hook uses the react context API.

# TODO

Change the configurations of useSubPrices to defaults and fix bugs

handle cancelation of subscription and payment failed

Decoding the JWTtoken on the frontend needs to be donde with a verification. If a user tampers it we still verify it on the server, but it adds security.

Review the error handling on PlanSelection
Set up "past_due"

Sign out only happens when subscription is made
we need a way to update the state of the user's rol after subscription

if we update the user state

- on reload it's lost since the \_app takes it from the token
  If we delete the access token to force retrieving a new, updated one
- the database record still may not be updated.
- We do not retrieve the user until a new request is made

We can use both techniques since the access token will expire and a new token will be issued with the updated state. If the payment fails later the hook will update that and the user will only have a day (access token lifetime) of free service.

the problem is that if the user reloads, the payment was succesful and the webhook still does not update the state it will not be available. A reload at a later time will solve this

Trying this when reloading the page:
if there is a refresh token. Try to fetch the user.

\

## JOURNAL

# 27/Aug/2021

Starting this version only because stripe doesn't work in my country. But as the mission progreses I aprecciate that this is an opportunitty to learn more about paypal too.

Also this a a test for the client code, that, if I've done it right should be agnostic to this change.

First: Determinate what things need to be changed.
