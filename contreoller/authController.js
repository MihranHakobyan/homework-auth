import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import { getAllUsers, getUser, saveUser, updateUser } from "../services/db.js";
import jwt from "jsonwebtoken"

class authController {
    async signup(req, res) {
        const { name, surName, login, password } = req.body

        if (!name.trim() || !surName.trim() || !login.trim()) {
            return res.status(400).send({ message: "missing filds" })
        }

        if (password.length < 6) {
            return res.status(400).send({ message: "password is too short" })
        }
        const found = await getUser(user => user.login == login)

        if (found) {
            res.status(400).send({ message: "login busy" })
        } else {
            const hashed = await bcrypt.hash(password, 10)
            await saveUser({ name, surName, login, password: hashed })
        }
        res.status(201).send({ message: "user seccesfuly created" })
    }


    async login(req, res) {
        const { login, password } = req.body
        if (!login.trim() || !password.trim()) {
            return res.status(400).send({ message: "missing filds" })
        }
        const user = await getUser(user => user.login == login)

        if (user) {
            const pass = await bcrypt.compare(password, user.password)
            if (pass) {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "20M" })
                return res.status(200).send({ token })
            }
            res.status(401).send({ message: "wrong password" })
        } else {
            res.status(404).send({ message: "wrong login" })
        }
    }

    async getUserInfo(req, res) {
        const user = await getUser(user => user.id == req.user.id)
        res.send(user)
    }

    async changeLogin(req, res) {
        const { login, password } = req.body

        if (!login.trim() || !password.trim()) {
            return res.status(400).send({ message: "missing filds" })
        }
        const newUser = await getUser(user => user.id == req.user.id)

        const pass = await bcrypt.compare(password, newUser.password)
        if (pass) {

            const exist = await getUser(user => user.login == login)

            if (exist) {
                return res.status(400).send({ message: "login busy" })
            }

            await updateUser(newUser.id, { login })

            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "20M" })

            return res.status(200).send({ token, message: "login changed successfully" })
        }
        res.status(401).send({ message: "wrong password" })
    }


}

export default new authController();