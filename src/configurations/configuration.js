export const OAuthConfig = {
    Google: {
        clientId: "890784479135-ooghqs178bf7b9orpvkac4jlt9l1tn4a.apps.googleusercontent.com",
        redirectUri: ["http://localhost:5173/auth/OAuth", "https://bephevch.up.railway.app/auth/OAuth"],
        authUri: "https://accounts.google.com/o/oauth2/auth",
    },
    Facebook: {
        clientId: "2810285332507650",
        clientSecret: "6a664aee52ffa796aa1664ab0a824e3b",
        redirectUri: ["http://localhost:5173/auth/OAuth", "https://bephevch.up.railway.app/auth/OAuth"],
        authUri: "https://www.facebook.com/v18.0/dialog/oauth",
    },
}