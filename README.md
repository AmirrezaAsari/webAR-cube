## webAR
A simple app to create a cube using webAR.

## Running the App
WebXR only supports HTTPS connections. To run the app, we need to set up an HTTPS connection, and we also need a mobile device for testing. To start the app:

1. Run `npm install`
2. Run `npm run start:live`

This will start the app and create a local tunnel using `lt`. When you run the app, a URL will be returned in the terminal. Follow that link and enter the IP address of the device running the app as the password. To get the IP address, you can use the following command in your terminal (for Windows):

```bash
curl ipv4.icanhazip.com
```

This project is based on the following guide: https://codemaker2016.medium.com/develop-your-first-webar-app-using-webxr-and-three-js-7a437cb00a92.