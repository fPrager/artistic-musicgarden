# artistic-musicgarden
webpage to visualize your music interests using Spotify API

![Sample Image](https://artistic-musicgarden--fprager.repl.co/canvas.png)

[See your Music Garden on Repl.it...](https://artistic-musicgarden--fprager.repl.co/?implicit=true)

## how to get your garden picture

To fetch your music preferences from your Spotify account, you need to grant access to the following information:
- account information (required to access your __top artists__)
- account activity (required to access your 50 __last played tracks__)

### option 1: one time picture route


Choose this option to allow a one time access. It won't use the registered artistic-music-garden-app to access your data, instead it uses a temporary access token.
Read more about this [implicit authorization workflow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow).

To use this method: 
- visit the repl with the [implicit parameter](https://artistic-musicgarden--fprager.repl.co/?implicit=true)
- login to your Spotify account
- click yes and wait until the Garden Picture is generated

### option 2: permanent picture route

If you want to have a permanent url to your music garden, the artisit-musicgarden app needs a permanent grant to access the Spoitfy account. 
Read more about this [authorization code workflow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow).

To use this method:
- visit the repl with the [normal url](https://artistic-musicgarden--fprager.repl.co/)
- login to you Spotify account
- click yes and wait until the Garden Picture is generated
- use the url (containing a __refresh_token__ in your browser to rerender a picture later (without the need to relogin) 

To revoke the access to your account:
- visit your [Spotify account](https://www.spotify.com/de/account/apps/)
- remove artistic-musicgarden from your app list

The access token is requested by a simple lambda function.

## tree rendering source

The source code to render a 2D tree comes from the repo [TreeGenerator](https://github.com/someuser-321/TreeGenerator) of [someuser-321](https://github.com/someuser-321).
Sketchlike Rendering with [RoughJS](https://roughjs.com/).