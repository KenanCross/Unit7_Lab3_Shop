"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const functions_1 = require("../functions/functions");
dotenv_1.default.config();
const router = (0, express_1.Router)();
const client = new mongodb_1.MongoClient(process.env.MONGODB_URI);
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const collection = yield (0, functions_1.loadCollection)(client, "users");
        const user = yield collection
            .find({ _id: new mongodb_1.ObjectId(req.params.id) })
            .toArray();
        if (user.length === 0) {
            res.status(404).json({ message: "No user found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        (0, functions_1.errorResponse)(error, res);
    }
    finally {
        yield client.close();
    }
}));
router.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const collection = yield (0, functions_1.loadCollection)(client, "users");
        const createdUser = yield collection.insertOne(req.body);
        res.status(201).json(Object.assign({}, createdUser));
    }
    catch (error) {
    }
    finally {
        yield client.close();
    }
}));
router.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const collection = yield (0, functions_1.loadCollection)(client, "users");
        const result = yield collection.updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: req.body });
    }
    catch (error) {
        (0, functions_1.errorResponse)(error, res);
    }
    finally {
        yield client.close();
    }
}));
router.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const collection = yield (0, functions_1.loadCollection)(client, "users");
        const result = yield collection.deleteOne({
            _id: new mongodb_1.ObjectId(req.params.id),
        });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "User Not Found" });
        }
        else {
            res.status(204).json({ message: "User deleted." });
        }
    }
    catch (error) {
    }
    finally {
        yield client.close();
    }
}));
exports.default = router;
