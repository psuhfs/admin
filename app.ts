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
import {Zone} from "./utils.js";
dotenv.config()

const PORT = process.env.PORT || 3000

type AdminUser = {
    email: string
    password: string
}

const authenticate = async (uname: string, password: string): Promise<AdminUser | null> => {
    let pw = createHash("sha256").update(password).digest("base64")
    let unameResult = await CREW_MEMBER.findOne({
        uname: uname,
        pw,
        zonalAccess: Zone.Admin,
    });
    if (unameResult) {
        return {
            email: `${unameResult.uname}@psu.edu`,
            password: unameResult.pw,
        }
    }

    let emailResult = await CREW_MEMBER.findOne({
        email: uname,
        pw,
        zonalAccess: Zone.Admin,
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
            logo: "https://raw.githubusercontent.com/psuhfs/admin/refs/heads/main/assets/psu_logo.png",
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
