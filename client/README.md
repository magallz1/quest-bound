# Compass Web App

Note that this package is being published to NPM (private is set to false in package.json), even though it's an application.
This is so Lerna will auto bump the version on releases, which will ensure each release gets a corresponding release.
This is needed to align source maps.

## Auth

_Sign Up_
Delete Beta test user

Navigate to beta.questbound.com

Click sign up

Enter
username: Beta Tester
email: beta-tester@/libstechnology.com
password: testPassword1!
confirm: testPassword1!

Click Submit

- Validate form should render

Refresh the page

- Validate form should render automatically

Get the validation code from email

Enter the validation code

- Auto redirect to /home

Refresh the page

- Should remain logged in

_Sign In Confirmed User_
Navigate to beta.questbound.com

If signed in, click top right drop down and sign out

- Should be on sign in tab

Enter
username: Beta Tester
password: testPassword1!

- Should redirect to /home

Refresh the page

- Should stay logged in

_Sign In Unconfirmed User_
Navigate to beta.questbound.com

- Should be on sign in tab

Enter
username: Beta Tester
password: testPassword1!

- Should open verify form

Click resend code

Enter code from email

- Should redirect to /home

Refresh the page

- Should stay logged in
