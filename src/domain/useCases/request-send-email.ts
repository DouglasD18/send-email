export interface User {
  name: string
  email: string
}

export interface RequestSendEmail {
  request(user: User): string
}