import { Group, IMessage, Message } from "./models";

export async function getAllMessages(userId: string) {
    const associatedGroups = await Group.find({
        members: userId
    });

    const messages = await Message.find({
        $or: [
            {
                receiverId: userId,
            },
            {
                $and: [
                    {
                        groupId: {
                            $in: associatedGroups.map(group => group._id)
                        }
                    }, {
                        remainingReceivers: userId
                    }
                ]
            }
        ]
    });

    return messages;
};

export async function getGroups(userId: string) {
    const groups = await Group.find({
        members: userId
    })

    return groups;
}

export async function deleteMessages(messages: IMessage[], userId: string) {
    if (messages.length === 0)
        return;
    for (const message of messages) {
        if (message.receiverId) {
            await message.deleteOne();
            continue;
        }
        if (message.groupId && message.remainingReceivers) {
            message.remainingReceivers = message.remainingReceivers.filter(receiver => String(receiver) !== userId)
            if (message.remainingReceivers.length === 0)
                await message.deleteOne();
            else
                await message.save();
        }
    }
}

export async function getGroupMembers(groupId: string) {
    const group = await Group.findOne({ _id: groupId });

    if (!group)
        return;

    return group.members;
}