/*
{
    "id": 1,
    "firstName": "Terry",
    "lastName": "Medhurst",
    "maidenName": "Smitham",
    "age": 50,
    "gender": "male",
    "email": "atuny0@sohu.com",
    "phone": "+63 791 675 8914",
    "username": "atuny0",
    "birthDate": "2000-12-25",
    "image": "https://robohash.org/Terry.png?set=set4",
    "bloodGroup": "A-",
    "height": 189,
    "weight": 75.4,
    "eyeColor": "Green",
    "domain": "slashdot.org",
    "ip": "117.29.86.254",
    "macAddress": "13:69:BA:56:A3:74",
    "university": "Capitol University",
    "createdAt": "2024-02-04T06:10:11.000Z",
    "hair": {
        "id": 1,
        "color": "Black",
        "type": "Strands"
    },
    "address": {
        "id": 1,
        "address": "1745 T Street Southeast",
        "city": "Washington",
        "postalCode": "20020",
        "state": "DC"
    },
    "bank": {
        "id": 1,
        "cardExpire": "06/22",
        "cardNumber": "50380955204220685",
        "cardType": "maestro",
        "currency": "Peso",
        "iban": "NO17 0695 2754 967"
    },
    "company": {
        "id": 1,
        "department": "Marketing",
        "name": "Blanda-O'Keefe",
        "title": "Help Desk Operator"
    }
}
*/
export interface User {
    id?: number;
    firstName?: string;
    lastName?: string;
    maidenName?: string;
    age?: number;
    gender?: string;
    email?: string;
    phone?: string;
    username?: string;
    birthDate?: string;
    image?: string;
    bloodGroup?: string;
    height?: number;
    weight?: number;
    eyeColor?: string;
    domain?: string;
    ip?: string;
    macAddress?: string;
    university?: string;
    createdAt?: string | null;
    hair?: Hair;
    address?: Address;
    bank?: Bank;
    company?: Company;
    name?: string;
    companyName?: string;
    addressName?: string;
}

export interface Address {
    id?: number;
    address?: string;
    city?: string;
    postalCode?: string;
    state?: string;
}

export interface Bank {
    id?: number;
    cardExpire?: string;
    cardNumber?: string;
    cardType?: string;
    currency?: string;
    iban?: string;
}

export interface Company {
    id?: number;
    department?: string;
    name?: string;
    title?: string;
}

export interface Hair {
    id?: number;
    color?: string;
    type?: string;
}
