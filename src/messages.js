
const categories = {
  romantic: {
    label: "Romantic Love ❤️",
    openings: [
      "Every moment with you feels like a beautiful dream.",
      "You are my favorite part of every day.",
      "My heart feels at home whenever I'm with you.",
      "Loving you is the sweetest adventure of my life.",
      "You make even ordinary moments unforgettable.",
      "If I could choose again, I would always choose you.",
      "Your smile makes my whole world brighter.",
      "My favorite love story is the one we're writing.",
      "You are the person my heart keeps choosing.",
      "Being loved by you is a gift I treasure.",
      "Every little thing about you makes me smile.",
      "You bring warmth into the coldest days.",
      "With you, love feels peaceful and exciting.",
      "I never knew happiness could feel this beautiful.",
      "You make my world feel full of possibilities.",
      "Your love is one of life's greatest surprises.",
      "My heart has found something extraordinary in you.",
      "The best moments are the ones we share.",
      "You make forever sound like a wonderful promise.",
      "I love the beautiful life we're creating together."
    ],
    endings: [
      "I hope we make a thousand more memories together. 💕",
      "You mean more to me than words can ever explain. ❤️",
      "Thank you for being such a beautiful part of my life. 💖",
      "I will keep choosing you, one day at a time. 🌹"
    ]
  },

  cute: {
    label: "Cute & Sweet 🧸",
    openings: [
      "You're my favorite notification.",
      "You make my heart do a little happy dance.",
      "You're sweeter than my favorite dessert.",
      "My day instantly improves when I hear from you.",
      "You're the sunshine in my pocket.",
      "If hugs were messages, I'd send you a million.",
      "You make butterflies feel like an everyday thing.",
      "You're my favorite person to annoy lovingly.",
      "Your smile deserves its own celebration.",
      "You are a walking collection of happy moments.",
      "Even boring days are fun when you're around.",
      "You're my favorite reason to check my phone.",
      "You make everything feel a little more magical.",
      "You deserve all the warm hugs in the universe.",
      "You're the cutest chapter of my life.",
      "I wish I could bottle up your laughter.",
      "You turn small moments into big smiles.",
      "You're my favorite kind of happiness.",
      "Life with you has extra sparkle.",
      "You're the sweetest surprise I never expected."
    ],
    endings: [
      "Sending you all my love and a giant hug! 🧸",
      "Never forget how adorable and special you are. 💗",
      "Keep smiling, because it looks wonderful on you. 🌸",
      "You make my world a happier place. 💕"
    ]
  },

  deep: {
    label: "Deep & Emotional 🥹",
    openings: [
      "Some people touch our hearts in ways words cannot explain.",
      "You have changed my life in the most beautiful ways.",
      "There are moments when I realize how lucky I am to know you.",
      "Your presence has become one of my greatest comforts.",
      "You understand pieces of me I struggle to explain.",
      "Some connections are too meaningful to measure.",
      "You remind me that love can be gentle and powerful.",
      "I am grateful for every memory we've created.",
      "You have brought light into parts of my life that needed it.",
      "You make me feel understood without saying a word.",
      "The kindness in your heart is something extraordinary.",
      "Our memories are treasures I carry everywhere.",
      "I appreciate the way you make people feel valued.",
      "You have taught me the beauty of genuine connection.",
      "I hope you always see how wonderful you truly are.",
      "Some people become part of our happiest memories.",
      "Your support means more than you may ever realize.",
      "Knowing you has made my world a better place.",
      "Your love and kindness leave beautiful marks on my heart.",
      "I wish you could see yourself through my eyes."
    ],
    endings: [
      "You will always have a special place in my heart. ❤️",
      "Thank you for being exactly who you are. 💖",
      "I hope life gives you all the love you deserve. 🌷",
      "Never doubt how much you mean to me. 💕"
    ]
  },

  birthday: {
    label: "Birthday Wishes 🎂",
    openings: [
      "Happy birthday to someone truly extraordinary!",
      "Today the world celebrates the wonderful person you are.",
      "Another year of your beautiful story begins today.",
      "May your birthday sparkle with joy and laughter.",
      "Today is all about celebrating you!",
      "Happy birthday to my favorite human!",
      "I hope your birthday feels as special as you are.",
      "A wonderful person deserves a wonderful birthday.",
      "May this new chapter bring beautiful surprises.",
      "Here's to another year of unforgettable memories.",
      "The world became brighter the day you were born.",
      "Today deserves extra cake, laughter, and love.",
      "May your birthday be filled with magical moments.",
      "I hope every birthday wish you make comes true.",
      "Celebrating you is one of life's happiest occasions.",
      "Your special day deserves endless happiness.",
      "May your year ahead be full of exciting adventures.",
      "Happy birthday to someone who makes life sweeter.",
      "Another year older and even more amazing!",
      "Today is the perfect excuse to remind you how loved you are."
    ],
    endings: [
      "May all your beautiful dreams come true. 🎂",
      "Wishing you endless smiles and unforgettable memories. 🎉",
      "You deserve a year overflowing with happiness. 💖",
      "Keep shining and being your wonderful self! ✨"
    ]
  },

  anniversary: {
    label: "Anniversary 💍",
    openings: [
      "Every chapter of our story is worth celebrating.",
      "Another year with you is another beautiful blessing.",
      "Our journey together is my favorite adventure.",
      "Thank you for another year of laughter and love.",
      "The memories we've made mean everything to me.",
      "Our love grows more meaningful with every passing year.",
      "Every anniversary reminds me how lucky I am.",
      "I treasure all the little moments that brought us here.",
      "Building a life of memories with you is wonderful.",
      "Our story keeps getting more beautiful.",
      "Another year, another collection of precious memories.",
      "You make commitment feel like a beautiful adventure.",
      "I love how our relationship continues to grow.",
      "Every year with you brings new reasons to smile.",
      "The best part of our journey is sharing it together.",
      "I cherish the love and trust we've built.",
      "Here's to the moments that made us stronger.",
      "You are still my favorite person to make memories with.",
      "Celebrating us will never get old.",
      "Every day together adds something beautiful to our story."
    ],
    endings: [
      "Happy anniversary, my love! ❤️",
      "Here's to many more wonderful years together. 💍",
      "I can't wait for all our future adventures. 💕",
      "Thank you for choosing this journey with me. 🌹"
    ]
  },

  distance: {
    label: "Long-Distance Love 🌙",
    openings: [
      "Miles may separate us, but you are always in my thoughts.",
      "Every sunrise brings us closer to our next hug.",
      "Distance cannot erase the memories we've made.",
      "I wish I could reach through this screen and hold you.",
      "Our love travels farther than any plane ever could.",
      "Even from far away, you make me smile.",
      "I count the days until we meet again.",
      "Every message from you makes the distance feel smaller.",
      "You are worth every mile between us.",
      "The night sky reminds me we're under the same stars.",
      "I miss the little moments we could be sharing.",
      "Our next reunion is a beautiful thought I hold onto.",
      "Distance has taught me to appreciate every conversation.",
      "I carry your love wherever I go.",
      "One day, our goodnights won't need a phone.",
      "I wish every goodbye could become a hello.",
      "Your voice makes even distant days feel warmer.",
      "Our memories keep me company when I miss you.",
      "Every day apart reminds me how special you are.",
      "No map could measure what you mean to me."
    ],
    endings: [
      "Until we meet again, I'm sending you all my love. ❤️",
      "I can't wait to hold you close. 🥹",
      "Our next hug will be worth the wait. 💕",
      "You are always close to my heart. 🌙"
    ]
  },

  friendship: {
    label: "Friendship 💛",
    openings: [
      "Life is better with a friend like you.",
      "You make ordinary adventures unforgettable.",
      "Good friends turn little moments into great memories.",
      "Your friendship is something I truly treasure.",
      "Thank you for all the laughter we've shared.",
      "You make difficult days a little easier.",
      "I'm grateful our paths crossed.",
      "You deserve friends who appreciate your wonderful heart.",
      "Every adventure is more fun with you.",
      "You're the kind of friend everyone hopes to find.",
      "Your support has meant so much to me.",
      "Some friendships become lifelong treasures.",
      "You always know how to make me laugh.",
      "I'm lucky to have someone like you in my corner.",
      "The memories we've made still make me smile.",
      "Thank you for being such a genuine friend.",
      "Our friendship is full of stories worth remembering.",
      "You bring so much positivity into people's lives.",
      "Here's to more spontaneous adventures together.",
      "Having you as a friend is a beautiful gift."
    ],
    endings: [
      "Never forget how appreciated you are! 💛",
      "Here's to many more memories together. ✨",
      "Thanks for being an amazing friend. 🫶",
      "Keep being your wonderful self! 🌻"
    ]
  },

  proposal: {
    label: "Forever & Proposals 💎",
    openings: [
      "I want to keep discovering life's beautiful moments with you.",
      "When I imagine my future, you're part of my happiest dreams.",
      "I want to grow older while collecting memories with you.",
      "My favorite plans are the ones that include us.",
      "You make the idea of forever feel beautiful.",
      "I want to celebrate every little victory by your side.",
      "You are the person I want beside me through life's adventures.",
      "I dream of building a future filled with love and laughter.",
      "I want our story to have countless beautiful chapters.",
      "You make tomorrow something I look forward to.",
      "I hope we keep choosing each other through every season.",
      "You are the person I want to share my dreams with.",
      "I want to make a lifetime of memories together.",
      "Every future adventure sounds better with you.",
      "I hope our love keeps growing through the years.",
      "You are my favorite thought when I imagine tomorrow.",
      "I want to celebrate the simple moments of life with you.",
      "Our future is a story I would love to keep writing.",
      "I hope we always find reasons to laugh together.",
      "There is something beautiful about dreaming together."
    ],
    endings: [
      "Will you keep writing this beautiful story with me? 💍",
      "Here's to a future full of love and adventures. ❤️",
      "I hope our best memories are still ahead of us. 💎",
      "Let's make our dreams beautiful together. 💕"
    ]
  }
};

export const messageCategories = Object.entries(categories).map(
  ([id, category]) => ({
    id,
    label: category.label,
    count: category.openings.length
  })
);

export const loveMessages = Object.entries(categories).flatMap(
  ([categoryId, category]) =>
    category.openings.map((opening, index) => ({
      id: `${categoryId}-${index + 1}`,
      category: categoryId,
      title: `${category.label} #${index + 1}`,
      text: `${opening} ${
        category.endings[index % category.endings.length]
      }`
    }))
);

export const getMessagesByCategory = (category) =>
  category === "all"
    ? loveMessages
    : loveMessages.filter(
        (message) => message.category === category
      );
