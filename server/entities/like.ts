import { Entity, JoinColumn, Column, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { User } from "./user";
import { Post } from "./post";
import { Reply } from "./reply";


@Entity({ name: "likes" })
@Unique(["user", "post", "reply"])
export class Like {

    @ManyToOne(type => User, user => user.likes)
    @JoinColumn({ name: "userId" })
    private user!: User;

    @PrimaryColumn()
    private userId!: number;

    @ManyToOne(type => Post, post => post.likes)
    @JoinColumn({ name: "postId" })
    private post!: Post;

    @PrimaryColumn()
    private postId!: number;

    @ManyToOne(type => Reply, reply => reply.likes)
    @JoinColumn({ name: "replyId" })
    private reply!: Reply;

    @Column({ nullable: true })
    private replyId!: number;

    public constructor(user: User, post: Post, reply?: Reply) {
        this.user = user;
        this.post = post;
        if (reply) {
            this.reply = reply;
        }
    }

    public getUser(): User {
        return this.user;
    }

    public getPost(): Post {
        return this.post;
    }

    public getReply(): Reply {
        return this.reply;
    }
}