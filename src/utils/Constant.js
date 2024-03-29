const AccountState = {
  Pending: 'pending',
  Active: 'active'
}

const FriendRequestState = {
  Pending: 'pending',
  Accepted: 'accepted',
  Decline: 'declined',
  Terminate: 'terminate',
  Cancel: 'canceled'
}

const Industry = {
  IT: 'it',
  Mining: 'mining',
  Accommodation: 'accommodation',
  Education: 'education',
  HealthService: 'health-service',
  Finance: 'finance',
  FoodManufacturing: 'food-manufacturing',
  Furniture: 'furniture',
  Gasoline:'gasoline',
  Hospitals: 'hospitals',
  Leather: 'leather',
  MotorVehicle: 'motor-vehicle',
  NaturalResource:'natural-resource',
  Telecommunication:'telecommunication',
  Wholesale: 'wholesale',
  WaterTransportation: 'water-transportation'
}

const Province = {
  Hanoi: 'hanoi',
  HochiminhCity: 'hochiminh-city',
  Danang: 'danang',
  Hue: 'hue',
  NamDinh: 'nam-dinh',
  HaiPhong: 'hai-phong',
  Other: 'others'
}

const OnlineState = {
  Online: 'online',
  Offline: 'offline'
}

const Reaction = {
  Like: 'like',
  Love: 'love',
  Angry: 'angry',
  Haha: 'haha',
  Sad: 'sad',
  Wow: 'wow',
  Care: 'care'
}

const Media = {
  Post: 'post',
  Photo: 'photo',
  Comment: 'comment'
}

const NotificationType = {
  Reaction: 'reaction',
  FriendAccept: 'friend-accept',
  Comment: 'comment',
}

const Relation = {
  Friend: 'friend',
  Stranger: 'stranger',
  SentRequest: 'sent-request',
  ReceiveRequest: 'receive-request',
  Me: 'me'
}

const EducationLevel = {
  HighSchool: 'high-school',
  College: 'college',
}

const Relationship = {
  Single: 'single',
  InARelationship: 'in-a-relationship',
  Married: 'married',
  Complicated: 'complicated',
  Other: 'other'
}

const MutationAction = {
  Create: 'create',
  Update: 'update',
  Push: 'push',
  Pull: 'pull',
  Delete: 'delete'
}

module.exports = {AccountState, FriendRequestState, Industry, Province, OnlineState, Reaction, Media, NotificationType, Relation, EducationLevel, Relationship, MutationAction}