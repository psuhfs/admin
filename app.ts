import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import mongoose from 'mongoose'
import {Database, Resource} from '@adminjs/mongoose'
import {Points} from "./schema/points.js";
import {CREW_MEMBER} from "./schema/user.js";
import {ORDER} from "./schema/order.js";
import { createHash } from "crypto";
import dotenv from 'dotenv'
dotenv.config()

const PORT = 3001

type AdminUser = {
    email: string
    password: string
}

const authenticate = async (uname: string, password: string): Promise<AdminUser | null> => {
    let unameResult = await CREW_MEMBER.findOne({
        uname: uname,
        pw: createHash("sha256").update(password).digest("base64"),
    });
    if (unameResult) {
        return {
            email: `${unameResult.uname}@psu.edu`,
            password: unameResult.pw,
        }
    }

    let emailResult = await CREW_MEMBER.findOne({
        email: uname,
        pw: createHash("sha256").update(password).digest("base64"),
    });
    if (emailResult) {
        return {
            email: emailResult.uname,
            password: emailResult.pw,
        }
    }
    return null
}

const start = async () => {
    const app = express()
    await mongoose.connect(process.env.MONGO_URI || '')
    AdminJS.registerAdapter({Database, Resource})

    const admin = new AdminJS({
        resources: [Points, CREW_MEMBER, ORDER],
        rootPath: '/',
        branding: {
            companyName: 'PSU HFS',
            logo: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogolook.net%2Fwp-content%2Fuploads%2F2022%2F11%2FPenn-State-University-Logo.png&f=1&nofb=1&ipt=445448e6bf6cc15a385150575edf4e41eb7b982564ad4fde3cf87e34c9a54e74",
            favicon: "https://avatars.githubusercontent.com/u/187778553",
            withMadeWithLove: false,
        },

    })


    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookieName: 'notCookie',
            cookiePassword: process.env.JWT || 'notSecure',
        },
        null,
        {
            resave: true,
            saveUninitialized: true,
            secret: process.env.JWT || 'notSecure',
            cookie: {
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
            },
            name: 'notSession',
        }
    )
    app.use(admin.options.rootPath, adminRouter)

    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    })
}

start()
