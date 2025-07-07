import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Credential } from "./Credential";

enum Role {
    ADMIN = "admin",
    USER = "user"
}

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100, nullable: false})
    name!: string;

    @Column({ type: "varchar", length: 100, unique: true, nullable: false })
    email!: string;

    @Column()
    phone!: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.USER
    })
    role!: Role;

    @OneToOne(() => Credential)
    @JoinColumn()
    credential!: Credential;
}

