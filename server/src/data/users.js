import { v4 as uuid } from 'uuid'

const users = [
  {
    id: uuid(),
    name: 'Linh Nguyen',
    email: 'linh@example.com',
    preferences: {
      genres: ['RPG', 'Strategy'],
      platforms: ['PC'],
      budget: 60
    }
  },
  {
    id: uuid(),
    name: 'Minh Tran',
    email: 'minh@example.com',
    preferences: {
      genres: ['Action'],
      platforms: ['Xbox', 'PC'],
      budget: 50
    }
  }
]

export default users
