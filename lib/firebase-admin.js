
NEXT_PUBLIC_ALGOLIA_APP_ID = "UQITXN5B6H"
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY = "df16d0b044a514a6c0cbb1114cf85e7e"
FIREBASE_PROJECT_ID = "babyparadisedeals"
FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCmei5Hd58KUA5G\nkN2j0wDl0cNfV7ypxBGJ+dKOzgllk5D9/mIAoB0LB+qoPiQ5K+lzVnKJ3yByHLvn\nEstD0ISjrFcFGYAtQGWIWff7FyzsB1QoH84LUhOR4SjWkGnW93okmT9xDjp7dhrQ\n8nt546lbdzoNJqFk8zlTrQ9zVkOrfjq2bAtm4bWOppNLWXfac4EbHyZAsk2AWOlM\nnfQAFPvc3fzwZ3y4u/8Vi7ycYw8H7zwZufwg6rpmYprduvevXuxKk0B311WKdpTI\nVjyZfCIFWNTmbfcjhYIlr9hlkikO7dYuExX4cgCOqGbWGeGU0zJvxBBc2khADjPY\nqZeSk5DtAgMBAAECggEABSMu0IgXP+iSpc68j3ZVQbWPtfgQuFxDeBkEZhSv8wyT\nAQrLror1la/PzmA+jdO2VfFN9Xj0H1L8lHsYWG/z2LlnWEVLCi2oBHiisulQurok\nkkMEmlJVDF+UFLNq5LyirkSOOEuw9jroK6V0Au6wFp4opZu/bf++6uXKEB94u27/\nL5tBoOs+nXD7Wo7yu2hkVd38eGtkJn5Ix1WF7GCw/aBpKiIS0xfPezXp1jWdGWt4\np5M7WEbbH/QQs0OQs4v0tMH/SVHXYBhuR5XkOUhMEcYEVniLops+LeDoH+lIKBEe\nlGjKao3uNxmAFFg8xddUutPjslepe1R2RCc7ye9oOQKBgQDb3mYys1o2+sBtKHk8\n9JI7tLyuC/uJlyxGb49E1uqRjx6ikRs24y+d/1Es4RVx0vEnpqW39eF73NjKmtch\nOd2m8lNYOJII2hqvMUeYF2SlMulJ+CFyBPh0W2jwqbNPz3Wksy4gbUN+vuxf4ndS\nmbCl3oM4k1Eh5jwSA1RqWU8M1QKBgQDB1atgPTGebUR4VOZVF7/F1RNLvogmZc/9\neQ2jlcTLkJmdU7roh9Slg0o+tJgsp6hu72GxNWi/gFF8Pzx5DGSJfKQGlgZIYwss\nlHWrqChkWgXPSP63pKbXAQSVasu1JdCg0/2oaC7VbQNwfniggJSenDMwMuFQwYJJ\nWXMh8w+fuQKBgHeTGk2UkQm5kZFMI7Ns52KlRr/5MFGB78hWv7oWj/eduHF9LSnK\noIjy4/jeaMVAjXqc/R9xD7JHR3fYggtF5y/2NjGSgolh5IVG7cLfZhMZ/xoFYlsa\nLO1LEWVhRW2wTDDIaduk0MJLn03+YhqADzwGKaNJKySejCjXur8j1wQJAoGBALum\ndVCoLV8ofT7ZQltisH9/djy/6eLycdb72F5j4a8JAA41Px9aUF0jqz7lauTgMsmi\n6bq67/tk6H4WYh72BmaryceuecqeR/USjJBwLRpppHI2QpHazsIa9CsKxsdKIp1w\nXYMpyR1Jeijv5yvLDxY2NcAVodeiXtVPyYw2WQvRAoGBAMybHUX29t2woq+0TsIs\ncJLeHLXU7YRRJiUnY9WTlyDnYMmvGSOgZNTMDULMgaytAoXFsdRq5YPypRPEEii+\njH4FoZm5O/rWYfs65Zwj9TDxMl/TRlrsQFheq+RWHRWpI+uLwbkeDa+Si13MFfbo\ns0BYcbnoVv+HfFabxhzYI/3i\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL = "firebase-adminsdk-2hae2@babyparadisedeals.iam.gserviceaccount.com"
const admin = require("firebase-admin");
const algoliasearch = require("algoliasearch");


admin.initializeApp({
    credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        // Fix escaped newlines in env
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
});

const firestore = admin.firestore();
const algoliaClient = algoliasearch(NEXT_PUBLIC_ALGOLIA_APP_ID, "c022744dae01fad9dfea2949133905b1");
const index = algoliaClient.initIndex("products");

(async () => {
    const snapshot = await firestore.collection("products").get();
    const products = [];

    snapshot.forEach(doc => {
        const data = doc.data();
        products.push({
            objectID: doc.id,
            name: data.name,
            price: data.price,
            image: data.imageURL,
            description: data.description,
            categoryRefs: data.categoryRefs || [],
            searchTags: data.searchTags || [],
        });
    });

    await index.saveObjects(products);
    console.log(`✅ Synced ${products.length} products to Algolia.`);
})();
