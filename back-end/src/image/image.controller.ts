import { Controller, Delete, Get, Inject, Param, Patch, Post, Response, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UserService } from 'src/user/user.service';


@Controller('image')
export class ImageController {
    constructor(@Inject('USER_SERVICE') private userService: UserService) {}

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: '../uploads',
            filename: (req, file, cb) => {
                cb(null, (Math.random() + 1).toString(36).substring(7) + req.headers.extension);
            }
        })
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
        //check cookie if authenticated

        console.log('file', file, id);
        let user = await this.userService.getUserById(id);
        try {
            if (user && user.avatar.length > 0)
                fs.unlinkSync('../uploads/' + user.avatar)
        } catch {
            console.log("Could not find file to delete");
        }

        user.avatar = file.filename;
        this.userService.updateUserById(user);
    }

    @Get()
    async getDefaultAvatar() {
        const file = fs.createReadStream('./static/default_avatar.png');
        return new StreamableFile(file);
    }

    @Get(':id')
    async getImage(@Param('id') id: string, @Response({passthrough: true}) res: any)
    {
        const user = await this.userService.getUserById(id)
        
        let file;
        if (user && user.avatar && user.avatar.length > 0)
        {
            file = fs.createReadStream(join('../uploads', user.avatar))
        } else 
            file = fs.createReadStream('./static/default_avatar.png')
    
            res.set('Content-Disposition', 'inline');//'attachment; filename=' + user.picture)
            return new StreamableFile(file);
        return
    }

    @Delete(':id')
    async deleteImage(@Param('id') id: string) {
        let user = await this.userService.getUserById(id);

        if(user && user.avatar &&user.avatar.length > 0)
        {
            try {
                console.log("trying to delete");
                
                fs.unlinkSync('../uploads/' + user.avatar)
                user.avatar = null;
                this.userService.updateUserById(user);
            } catch {
                console.error("Could not delete image: " + user.avatar);
                
            }
        }
    }
}
