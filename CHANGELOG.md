# Local Coffee Finder Change Log



### 0.0.1 12/11/2018 'UI changes for small screens'

#### Features
- Location radius component optimized for all screen sizes
- Home page fab buttons become toolbar buttons for small screens



### 0.0.1 11/29/2018 'Geolocation fixes, ui fixes'

#### Features
- Adsense - Created custom footer ad component to implement Adsense, ad request pending
- Alerts - Favorite alerts refactored to VenueDetails modal component and UserSettings page
- Geolocation - no correctly recenters map and radius circle initially and on both location and radius updates



### 0.0.1 11/28/2018 'Google Maps API Directions added'

#### Features
- Google Maps API - implemented DirectionsService and DirectionsRenderer
- Directions modal incudes mini map, distance, steps, starting location, step guide, and ending location
#### Removed 
- Foursquare API - node-foursquare



### 0.0.1 11/24/2018 'Account linking, info window modal fixes, Home page Feed'

@Angular/Fire
- Authentication - Unlink account by provider
- Authentication - Link account by provider or email
- Authentication - Reauthentication

#### Features
- Selected Venue Info window position and sizing fixed
- Modal css added to variables.scss
- Home Page shows rss feed entries



### 0.0.1 11/20/2018 'Map UI updates and additions, Foursquare added'

#### Features
- Installed node-foursquare
- 'You are here' marker disctinct from venues
- Location radius no longer changes with map panning, now a fab + popover
- User interface 'favorite<Venue>' property added
- <tab-bar> added to info window
- Add or remove a favorite venue, disabled if no user
- Favorite venue added to user-settings page, with edit, remove and add options



### 0.0.1 11/14/2018 'Twitter authentication added, Auth 90% done'

@ANGULAR/FIRE
- Authentication - Twitter browser & native login, logout, get twitter user data
- Authentication - Change password, change email, send email verification

@IONIC-NATIVE
- HeaderColor
- Twitter
- AdMobPro

@IONIC STORAGE
- Storage service created

#### Features
- added 'emailVerified: boolean' and 'ProviderId: string' to interface User
- Password reset, update user password & email
- show OAuth provider
- Added Terms of Service and Privacy Policy

#### Notes
- Comments complete from services/*



### 0.0.1 11/13/2018 'Facebook authentication added'

@ANGULAR/FIRE
- Authentication - Facbook browser & native login, logout, check facebook user status
- Authentication - forgot password, added verfiy email button

@IONIC-NATIVE
- Facebook



### 0.0.1 INITIAL COMMIT

@ANGULAR/FIRE
- Authentication - Implemented email login & register, google browser & native login, logout
- Firestore - Implmented updating firebase user, retrieving user data, and adding user data

@AGM/core
- Angular Google Maps - Implemented map load, AGM marker, and AGM circle
 
@IONIC-NATIVE
- Admob Free
- Geolocation
- Google Maps
- Ionic Webview
- Splashscreen
- Statusbar

##### Features:
- Tabs updated to 4.0.0-beta.15
- Router guard and resolve on User Page
- Theme Service setup, inactive presently
