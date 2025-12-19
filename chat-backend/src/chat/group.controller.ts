import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from '../schemas/message.schema';
import { Group } from '../schemas/group.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Controller('groups')
export class GroupController {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>,
            @InjectModel('User') private userModel: Model<any>) {}
  

  @Post('create')
  async createGroup(@Body() data: { name: string, members: string[] }) {
    const newGroup = new this.groupModel({
      name: data.name,
      roomId: `group_${Date.now()}`,
      members: data.members,
    });
    return newGroup.save();
  }

  @Get('user/:userId')
  async getMyGroups(@Param('userId') userId: string) {

    return this.groupModel.find({ members: userId }).exec();
  }

//     @Get(':roomId/members')
//     async getGroupMembers(@Param('roomId') roomId : string) {
//          const group= await this.groupModel.findOne({roomId}).exec();
//         if(!group) return [];
//             return this.userModel.find({_id: { $in: group.members}}). select('name').exec();
//     }
// }

//  @Get(':roomId/members')
//     async getGroupMembers(@Param('roomId') roomId : string) {
//          const group= await this.groupModel.findOne({roomId}).exec();
//          console.log("Room id found",roomId);

         
        
//         if(!group || !group.members || group.members.length === 0){
    
//             // console.log("members",group.members.length);
//               return [];
//         } 
//             return this.userModel.find({_id: { $in: group.members}}). select('name').exec();
//     }
// }
@Get(':roomId/members')
async getGroupMembers(@Param('roomId') roomId: string) {
    // 1. Find the group document
    const group = await this.groupModel.findOne({ roomId }).exec();
    
    // Log for your debugging
    console.log("Found Group:", group);

    if (!group || !group.members || group.members.length === 0) {
        return [];
    }

    // 2. Convert string IDs into MongoDB ObjectIds 
    // This is usually why you get an empty array
    const memberObjectIds = group.members.map(id => new Types.ObjectId(id));

    // 3. Query the User model to find names matching those IDs
    const memberDetails = await this.userModel
        .find({ _id: { $in: memberObjectIds } })
        .select('name') // Only get the name field
        .exec();

    console.log("Fetched Member Names:", memberDetails);
    return memberDetails;
}
}