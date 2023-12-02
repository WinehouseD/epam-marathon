import { ChatLastMessage, Message, UserDetailed } from '../app/main/main.model';

export const CHATS_MOCK: ChatLastMessage[] = [
  {
    name: 'Lola Smith',
    email: '1',
    avatar: '/mocks/img/cat.jpg',
    lastMessageDateTime: '10:00 AM',
    lastMessage: 'Halo! Good Morning, whats up man?'
  },
  {
    name: 'Ali Connors',
    email: '2',
    avatar: '/mocks/img/woman.jpg',
    lastMessageDateTime: '11:30 AM',
    lastMessage: 'So yes, the alcohol (ethanol) in hand sanitizers can be absorbed through the skin, but no, it would '
  },
  {
    name: 'John Doe',
    email: '3',
    avatar: '/mocks/img/user_3.jpg',
    lastMessageDateTime: '11:30 AM',
    lastMessage: 'The study was repeated with three brands of hand sanitizers containing 55%, 85%, and 95% ethanol. Th'
  },
  {
    name: 'Sarah Johnson',
    email: '4',
    avatar: '/mocks/img/user_4.jpg',
    lastMessageDateTime: '11:30 AM',
    lastMessage: 'Twenty 30-second applications within half an hour is well in excess of almost anyone’s use of a sani'
  },
  {
    name: 'Sophia Brown',
    email: '5',
    avatar: '/mocks/img/user_5.png',
    lastMessageDateTime: '11:30 AM',
    lastMessage:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.'
  },
  {
    name: 'Daniel Martinez',
    email: '6',

    avatar: '/mocks/img/user_6.png',
    lastMessageDateTime: '11:30 AM',
    lastMessage: "Hey, how's it going?"
  },
  {
    name: 'LongName LongSurname',
    email: '7',

    avatar: '/mocks/img/user_7.jpg',
    lastMessageDateTime: '11:30 AM',
    lastMessage: 'That sounds amazing! What was the best part of your hike?'
  },
  {
    name: 'William Taylor',
    email: '8',

    avatar: '/mocks/img/user_8.jpg',
    lastMessageDateTime: '11:30 AM',
    lastMessage: 'Rainy days can be cozy if you have a good book and some hot tea. How do you like to spend them?'
  },
  {
    name: 'Ava Miller',
    email: '9',

    avatar: '/mocks/img/user_9.png',
    lastMessageDateTime: '11:30 AM',
    lastMessage: "I'm planning a road trip for the summer. Any must-visit destinations?"
  },
  {
    name: 'James Harris',
    email: '10',
    avatar: '/mocks/img/user_10.jpg',
    lastMessageDateTime: '11:30 AM',
    lastMessage: 'I just got a promotion at work!'
  }
];

export const PERSONAL_DATA_MOCK: UserDetailed = {
  name: 'User Userov',
  email: '100',
  birthday: 179712000000,
  registration: new Date().getTime(),
  about: 'Angular lover',
  interests: ['Travel', 'Family'],
  location: 'Ukraine, Dnipro',
  avatar: '/mocks/img/avatar.png',
  socialMedia: {
    instagram: 'insta',
    facebook: 'fb',
    linkedin: '../company/epam-systems',
    skype: 'call_me',
    telegram: 'upamer'
  },
  privacy: {
    description: false,
    location: false,
    account: true,
    age: true
  }
};

export const USERS_MOCK: UserDetailed[] = [
  {
    name: 'Lola Smith',
    email: '1',
    birthday: new Date().getTime(),
    registration: new Date().getTime(),
    about: '',
    interests: ['Health', 'Travel'],
    location: 'Lviv',
    avatar: '/mocks/img/user_1.jpg',
    socialMedia: {
      instagram: 'epam_ukraine',
      linkedin: '../company/epam-systems',
      facebook: '',
      skype: '',
      telegram: ''
    },
    privacy: {
      description: false,
      location: false,
      account: true,
      age: true
    }
  },
  {
    name: 'Ali Connors',
    email: '2',
    birthday: 961027200000,
    registration: new Date().getTime(),
    about: 'Lorem ipsum dolor sit',
    interests: ['Health', 'Travel'],
    location: 'New York',
    avatar: '/mocks/img/user_2.jpg',
    socialMedia: {
      instagram: 'epamsystems',
      facebook: 'EPAM.Ukraine',
      linkedin: '../company/epam-systems',
      skype: '',
      telegram: ''
    },
    privacy: {
      description: false,
      location: false,
      account: true,
      age: true
    }
  },
  {
    name: 'John Doe',
    email: '3',
    birthday: new Date().getTime(),
    registration: new Date().getTime(),
    about: 'Tech enthusiast and travel lover',
    interests: ['Attractions', 'Travel', 'Sports'],
    location: 'New York',
    avatar: '/mocks/img/user_3.jpg',
    socialMedia: {
      instagram: 'johndoe_adventures',
      facebook: 'johndoe123',
      linkedin: '../company/epam-systems',
      skype: '',
      telegram: ''
    },
    privacy: {
      description: false,
      location: false,
      account: true,
      age: true
    }
  },
  {
    name: 'Sarah Johnson',
    email: '4',
    birthday: new Date().getTime(),
    registration: new Date().getTime(),
    about: 'Nature lover, fitness enthusiast, and bookworm',
    interests: ['Dining', 'Sports', 'Family', 'Travel', 'Education'],
    location: 'San Francisco',
    avatar: '/mocks/img/user_4.jpg',
    socialMedia: {
      instagram: 'sarah_nature_fit',
      facebook: '',
      linkedin: '../company/epam-systems',
      skype: '',
      telegram: ''
    },
    privacy: {
      description: false,
      location: false,
      account: true,
      age: true
    }
  },
  {
    name: 'Sophia Brown',
    email: '5',
    birthday: 793929600000,
    registration: new Date().getTime(),
    about: 'Art lover and coffee addict',
    interests: ['Travel', 'Family', 'Health', 'Promotions', 'Sports', 'Education', 'Dining', 'Office'],
    location: 'Seattle',
    avatar: '/mocks/img/user_5.png',
    socialMedia: {
      instagram: 'sophia_art_coffee',
      facebook: 'sophia.brown',
      linkedin: '../company/epam-systems',
      skype: 'sophia_brown789',
      telegram: 'sophia_coffee_lover'
    },
    privacy: {
      description: false,
      location: false,
      account: true,
      age: true
    }
  },
  {
    name: 'Daniel Martinez',
    email: '6',
    birthday: 747792000000,
    registration: new Date().getTime(),
    about: 'Hiking enthusiast and tech geek',
    interests: ['Travel', 'Family', 'Sports', 'Education', 'Dining', 'Office'],
    location: 'Denver',
    avatar: '/mocks/img/user_6.png',
    socialMedia: {
      instagram: 'daniel_hiker_tech',
      facebook: 'daniel.martinez',
      linkedin: '../company/epam-systems',
      skype: 'daniel_martinez123',
      telegram: 'daniel_tech_geek'
    },
    privacy: {
      description: false,
      location: false,
      account: true,
      age: true
    }
  },
  {
    name: 'LongName LongSurname',
    email: '7',
    birthday: 549676800000,
    registration: new Date().getTime(),
    about: '',
    interests: ['Travel'],
    location: 'Netherlands, Hoofddorp, Mercuruissplein 1',
    avatar: '/mocks/img/user_7.jpg',
    socialMedia: {
      instagram: 'olivia_animal_fashion',
      facebook: 'olivia.anderson',
      linkedin: '../company/epam-systems',
      skype: 'olivia_anderson456',
      telegram: 'olivia_dance_queen'
    },
    privacy: {
      description: false,
      location: false,
      account: true,
      age: true
    }
  },
  {
    name: 'William Taylor',
    email: '8',
    birthday: 343353600000,
    registration: new Date().getTime(),
    about: 'History buff and astronomy enthusiast',
    interests: [],
    location: '',
    avatar: '/mocks/img/user_8.jpg',
    socialMedia: {
      instagram: 'william_history_star',
      facebook: 'william.taylor',
      linkedin: '../company/epam-systems',
      skype: 'william_taylor789',
      telegram: 'william_astronomy_lover'
    },
    privacy: {
      description: false,
      location: false,
      account: true,
      age: true
    }
  },
  {
    name: 'Ava Miller',
    email: '9',
    birthday: 891734400000,
    registration: new Date().getTime(),
    about: 'Gaming enthusiast and anime lover',
    interests: [],
    location: 'Austin',
    avatar: '/mocks/img/user_9.png',
    socialMedia: {
      instagram: 'ava_gamer_anime',
      facebook: 'ava.miller',
      linkedin: '../company/epam-systems',
      skype: 'ava_miller123',
      telegram: 'ava_anime_fan'
    },
    privacy: {
      description: false,
      location: false,
      account: true,
      age: true
    }
  },
  {
    name: 'James Harris',
    email: '10',
    birthday: 525052800000,
    registration: new Date().getTime(),
    about: '',
    interests: [],
    location: 'San Diego',
    avatar: '/mocks/img/user_10.jpg',
    socialMedia: {
      instagram: '',
      facebook: '',
      linkedin: '',
      skype: '',
      telegram: ''
    },
    privacy: {
      description: false,
      location: false,
      account: true,
      age: true
    }
  },
  PERSONAL_DATA_MOCK
];

export const CHAT_MOCK: Message[] = [
  {
    id: '17',
    chatId: 'chat-1',
    sender: '1',
    time: '2023-10-30:15:00',
    text: 'See you later!',
    read: false
  },
  {
    id: '16',
    chatId: 'chat-1',
    sender: '2',
    time: '2023-10-30:15:00',
    text: 'Thank you! Talk to you later.',
    read: true
  },
  {
    id: '15',
    chatId: 'chat-1',
    sender: '2',
    time: '2023-10-29T08:10:00',
    text: 'Well, I will let you get ready for the gym. Have a great workout!',
    read: true
  },
  {
    id: '14',
    chatId: 'chat-1',
    sender: '1',
    time: '2023-10-29T08:05:00',
    text: 'You are absolutely right.',
    read: true
  },
  {
    id: '13',
    chatId: 'chat-1',
    sender: '1',
    time: '2023-10-27T08:00:00',
    text: 'It is important to take care of your health.',
    read: true
  },
  {
    id: '12',
    chatId: 'chat-1',
    sender: '2',
    time: '2023-10-25T08:08:00',
    text: 'I try to stay active.',
    read: true
  },
  {
    id: '11',
    chatId: 'chat-1',
    sender: '2',
    time: '2023-10-25T08:12:00',
    text: 'Thats a healthy choice!',
    read: true
  },
  {
    id: '10',
    chatId: 'chat-1',
    sender: '1',
    time: '2023-10-25T08:14:00',
    text: 'Im going to the gym later.',
    read: true
  },
  {
    id: '9',
    chatId: 'chat-1',
    sender: '1',
    time: '2023-10-25T08:40:00',
    text: 'How about you? Any plans?',
    read: true
  },
  {
    id: '8',
    chatId: 'chat-1',
    sender: '1',
    time: '2023-10-25T08:35:00',
    text: 'Sounds like a good plan.',
    read: true
  },
  {
    id: '7',
    chatId: 'chat-1',
    sender: '2',
    time: '2023-10-25T08:30:00',
    text: 'Not really, just relaxing at home.',
    read: true
  },
  {
    id: '6',
    chatId: 'chat-1',
    sender: '2',
    time: '2023-10-24T08:25:00',
    text: 'I understand. Any exciting plans for the evening?',
    read: true
  },
  {
    id: '5',
    chatId: 'chat-1',
    sender: '1',
    time: '2023-10-24T08:20:00',
    text: "It's been a busy day at work.",
    read: true
  },
  {
    id: '4',
    chatId: 'chat-1',
    sender: '1',
    time: '2023-10-24T08:15:00',
    text: 'How has your day been?',
    read: true
  },
  {
    id: '3',
    chatId: 'chat-1',
    sender: '1',
    time: '2023-10-24T08:10:00',
    text: "That's great to hear!",
    read: true
  },
  {
    id: '2',
    chatId: 'chat-1',
    sender: '2',
    time: '2023-10-24T08:05:00',
    text: 'I am doing well, thanks!',
    read: true
  },
  {
    id: '1',
    chatId: 'chat-1',
    sender: '1',
    time: '2023-10-24T08:00:00',
    text: 'Hello, how are you?',
    read: true
  }
];
