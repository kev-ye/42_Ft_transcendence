import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageBody } from '@nestjs/websockets';
import { BanService } from 'src/ban/ban.service';
import { BlockService } from 'src/block/block.service';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { ModeratorService } from 'src/moderator/moderator.service';
import { MuteService } from 'src/mute/mute.service';
import { PrivateInviteService } from 'src/private-invite/private-invite.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ChannelEntity } from './entity/channels.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelEntity) private repo: Repository<ChannelEntity>,
    private modService: ModeratorService,
    private privateInvService: PrivateInviteService,
    @Inject('BAN_SERVICE') private banService: BanService,
    @Inject('MUTE_SERVICE') private muteService: MuteService,
    @Inject('USER_SERVICE') private userService: UserService,
    @Inject('CHAT_HISTORY_SERVICE') private historyService: ChatHistoryService,
    @Inject('BLOCK_SERVICE') private blockService: BlockService,
  ) {}

  async checkOwner(userID: string, data: { chat_id: string }) {
    if (!data || !data.chat_id) return false;
    const chan = await this.getChannelById(data.chat_id);
    if (!chan || chan.creator_id != userID) return false;
    return true;
  }

  async checkModerator(userID: string, data: { chat_id: string }) {
    if (!data || !data.chat_id) return false;

    const chan = await this.modService.isModerator(data.chat_id, userID);
    if (!chan) return false;
    return true;
  }

  async getAll(userID: string) {
    const tmp = await this.repo.find();
    for (const data of tmp) {
      const tab = await this.modService.getModeratorsByChatID(data.id);
      if (tab.find((val) => val.user_id == userID)) data['moderator'] = true;
      else data['moderator'] = false;
    }
    return tmp;
  }

  async getChannelById(id: string) {
    return await this.repo.findOne({id: id});
  }

  async getChannelByName(name: string) {
    return await this.repo.findOne({ name: name });
  }

  async checkPassword(password: string, chat_id: string) {
    const tmp = await this.repo.findOne({ id: chat_id });
    if (tmp && tmp.access == 1 && tmp.password) {
      //check hashed version of password
      console.log('test password : ', password == tmp.password);

      if (password == tmp.password) return true;
    }
    return false;
  }

  async checkAccess(userID: string, chatID: string) {
    console.log("oui");
    const channel = await this.getChannelById(chatID);
    console.log("oui 2", channel);
    if (!channel) return 1;
    if (await this.banService.isBanned(userID, chatID)) return 2;
    else if (await this.modService.isModerator(chatID, userID)) return 0;
    console.log("oui 3");
    if (channel.access == 2) {
      if (!(await this.privateInvService.isInvited(userID, chatID))) return 1;
    }
    return 0;
  }

  async updateById(userID: string, data: any) {
    return await this.repo.update(
      { id: data.id },
      { ...data, creator_id: userID },
    );
  }

  async createChannel(userID: string, data: any) {
    const result = this.repo.create({ ...data, creator_id: userID });

    if (!result) return;
    const tmp = (await this.repo.save(result)) as any;
    return await this.modService.createModerator(userID, {
      user_id: data.creator_id,
      chat_id: tmp.id,
    });
  }

  async createModerator(
    userID: string,
    data: { user_id: string; chat_id: string },
  ) {
    Logger.log('Trying to mod user');
    if (!(await this.checkOwner(userID, data))) return;

    return await this.modService.createModerator(userID, data);
  }

  async deleteModerator(
    userID: string,
    data: { chat_id: string; user_id: string },
  ) {
    if (!(await this.checkOwner(userID, data))) {
      Logger.log('Deleting moderator request made by non-owner');
      return;
    } else if (await this.checkOwner(data.user_id, data)) {
      Logger.log('Deleting moderator request made on owner');
      return;
    }

    return await this.modService.deleteModerator(userID, data);
  }

  async deleteAllModerator(
    userID: string,
    data: { chat_id: string; user_id: string },
  ) {
    if (!(await this.checkOwner(userID, data))) return;

    return await this.modService.deleteAllModerator(data);
  }

  async createMute(
    userID: string,
    data: { chat_id: string; user_id: string; date: Date },
  ) {
    if (!(await this.checkModerator(userID, data))) return;
    else if (await this.checkOwner(data.user_id, data)) return;

    return await this.muteService.addMute(data);
  }

  async deleteMute(userID: string, data: any) {
    if (!(await this.checkModerator(userID, data))) return;
    return await this.muteService.deleteMute(data);
  }

  async getMute(chatID: string, userID: string) {
    return await this.muteService.getMute(chatID, userID);
  }

  async banUser(userID: string, data: { user_id: string; chat_id: string }) {
    if (!(await this.checkModerator(userID, data))) return;
    else if (await this.checkOwner(data.user_id, data)) return;

    return await this.banService.banUser(data);
  }

  async getBanByUser(userID: string) {
    return await this.banService.getBanByUser(userID);
  }

  async isBanned(userID: string, chatID: string) {
    return await this.banService.isBanned(userID, chatID);
  }

  async deleteBan(userID: string, data: any) {
    if (!data || !data.chat_id || !data.user_id) return;
    if (!this.checkModerator(userID, data)) return;
    return await this.banService.deleteBan(data.user_id, data.chat_id);
  }

  async inviteToChannel(userID: string, data: any) {
    if (!(await this.checkModerator(userID, data))) return;
    const chan = this.repo.findOne({ id: data.chat_id });
    if (!chan) return;
    return await this.privateInvService.createInvite(data);
  }

  async inviteToChannelByName(userID: string, userName: string, data: any) {
    const user = await this.userService.getUserById(userID);

    if (!(await this.checkModerator(userID, data))) return 2;
    if (!user) return 1;
    const chan = this.repo.findOne({ id: data.chat_id });
    if (!chan) return 3;
    await this.privateInvService.createInvite({
      user_id: user.id,
      chat_id: data.chat_id,
      emitter: userID,
    });
    return 0;
  }

  async deleteChannel(userID: string, chatID: string) {
    await this.modService.deleteAllModerator({ chat_id: chatID });
    await this.muteService.deleteAllByChatId(chatID);
    await this.privateInvService.deleteAllByChat(chatID);
    await this.historyService.deleteByChatID(chatID);
    return await this.banService.deleteAllByChatId(chatID);
  }
}
