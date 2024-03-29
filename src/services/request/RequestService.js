const UserModel = require("../user/UserModel");
const {AccountState, FriendRequestState, NotificationType} = require("../../utils/Constant");
const RequestModel = require("./RequestModel");
const {DateTime} = require("luxon");
const {httpError} = require("../../utils/HttpError");
const ConversationModel = require("../conversation/ConversationModel");
const MessageModel = require("../message/MessageModel");
const {NotificationService} = require("../notifications/NotificationService");
const socketClient = require("../../config/socketClient");

class RequestService {

  async createFriendRequest({from, to, message}) {
    if (from === to) {
      throw Error('Invalid request, Can not send request to same person');
    }

    const users = await UserModel.find(
      {
        _id: {$in: [from, to]},
        state: {$eq: AccountState.Active}
      }).lean();

    if (users.length !== 2) {
      throw Error("User does not existed");
    }
    let check = await RequestModel.findOne({
      from, to,
      state: {$in: [FriendRequestState.Pending, FriendRequestState.Accepted]}
    });

    if (check) {
      throw Error("Friend request exited");
    }

    let requestData = {
      from, to, message,
      ...{
        date: DateTime.now(),
        state: FriendRequestState.Pending
      }
    };

    const request = await RequestModel.create(requestData);

    const data =
      await RequestModel.populate(request, {path: 'from', select: {avatar: 1, fullName: 1}});
    this.notifyNewFriendRequest({from, to, data})

    return data;
  }

  async updateFriendRequest(userId, requestId, state) {
    const request = await RequestModel.findOne({
      _id: requestId
    }).lean();

    if (!request) {
      throw httpError.badRequest('Request not exist');
    }

    const fromUser = await UserModel.findOne({_id: request.from}).lean();
    if (!fromUser) {
      throw httpError.badRequest('User not existed');
    }

    if (userId !== request.to.toString() && state === FriendRequestState.Accepted) {
      throw httpError.unauthorize('You are not allowed to accept this request');
    }

    if (request.state !== FriendRequestState.Pending) {
      throw httpError.badRequest('Request error ')
    }
    if (![FriendRequestState.Accepted, FriendRequestState.Decline, FriendRequestState.Cancel].includes(state)) {
      throw httpError.badRequest('Invalid update state');
    }

    await RequestModel.updateOne({
      _id: requestId
    },{
      $set: {
        state
      }
    })

    if (state === FriendRequestState.Decline || state === FriendRequestState.Cancel) {
      return;
    }
    let conversation = await ConversationModel.findOne({
      participants: {
        $size: 2,
        $all: [request.from, userId]
      }}).lean();

    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [request.from, userId]
      });

    }

    let conversationId = conversation._id;
    if (request.message) {
      const message = await MessageModel.create({
        conversationId,
        from: request.from,
        date: request.date,
        textContent: request.message
      })
      await ConversationModel.updateOne({
        _id: conversationId
      }, {
        $set: {
          lastMessageId: message._id
        }
      });
    }



    await UserModel.updateOne({
      _id: userId
    }, {
      $push: {
        friends: {
          friendId: request.from,
          conversationId,
          date: Date.now()
        }
      }
    });

    await UserModel.updateOne({
      _id: request.from
    }, {
      $push: {
        friends: {
          friendId: userId,
          conversationId,
          date: Date.now()
        }
      }
    });

    NotificationService.notify({from: userId, to: request.from, type: NotificationType.FriendAccept})

    return {conversation}
  }

  async updateUnseenInvitations(userId, unseenIds) {
    const unseenRequests = await RequestModel.find({_id: {$in: unseenIds}}).lean();
    if (unseenRequests.some(request => request.to.toString() !== userId)) {
      throw httpError.badRequest('Invalid userId');
    }

    await RequestModel.updateMany({
      _id: {$in: unseenIds}
    }, {
      $set: {
        seen: true
      }
    })
  }

  async countUnseenInvitations(userId) {
    const count = await RequestModel.countDocuments({
      to: userId,
      seen: false
    });

    return count;
  }

  async notifyNewFriendRequest({from , to, data}){
    const unseen = await RequestModel.countDocuments({to, seen: false, state: FriendRequestState.Pending})
    await socketClient.post('/socket-friend-request',{from, to, data, unseen} , {
      headers: {
        'x-access-token': process.env.SOCKET_TOKEN
      }
    })
  }
}

module.exports = {RequestService: new RequestService()}
