import User from "../models/User.js";
import bcrypt from "bcrypt";
import { __dirname } from "../server.js";
import { deleteFromGCS } from "../GCS api/deleteFromGCS.js";

//UPDATE USER

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (req.body.userId === req.params.id) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }

            try {
                const updatedUser = await User.findByIdAndUpdate(
                    req.params.id,
                    { $set: req.body },
                    { new: true }
                );
                //delete profile pic
                user.profilePic && deleteFromGCS(user.profilePic);
                res.status(200).json(updatedUser);
            } catch (error) {
                res.status(404).json(error);
                console.log(error);
            }
        } else {
            res.status(401).json("Możesz aktualizować tylko swoje konto!");
        }
    } catch (error) {
        console.log(error);
    }
};

//DELETE USER

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user.id === req.params.id) {
            try {
                await User.findByIdAndDelete(req.params.id);
                user.profilePic && deleteFromGCS(user.profilePic);
                res.status(200).json("Usunięto pomyślnie...");
            } catch (err) {
                res.status(404).json(err);
            }
        } else {
            res.status(401).json("Możesz usunąć tylko swoje konto!");
        }
    } catch (err) {
        console.log(err);
    }
};

//GET USER
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
};
