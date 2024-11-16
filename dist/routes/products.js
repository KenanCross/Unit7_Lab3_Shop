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
router.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const collection = yield (0, functions_1.loadCollection)(client, "products");
        const query = {};
        if (req.query["max-price"]) {
            query.price = { $lte: parseInt(req.query["max-price"], 10) };
        }
        if (req.query.includes) {
            query.name = { $regex: new RegExp(req.query.includes, "i") };
        }
        if (req.query.limit) {
            query.name = { $limit: parseInt(req.query.limit, 10) };
        }
        const products = yield collection.find({ query }).toArray(); //run query on MongoDB Collection and return as Array for JSON manipulation
        res.status(200).json(products);
    }
    catch (error) {
        (0, functions_1.errorResponse)(error, res);
    }
    finally {
        yield client.close();
    }
}));
router.get("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const collection = yield (0, functions_1.loadCollection)(client, "products");
        const id = req.params.id;
        const result = yield collection.find({ _id: new mongodb_1.ObjectId(id) }).toArray();
        if (result.length === 0) {
            res.status(404).json({ message: "Product not found" });
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
    finally {
        yield client.close();
    }
}));
router.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const collection = yield (0, functions_1.loadCollection)(client, "products");
        const newProduct = req.body;
        const result = yield collection.insertOne(newProduct);
        res
            .status(201)
            .json(Object.assign({ message: "Created", _id: result.insertedId }, result));
    }
    catch (error) {
        (0, functions_1.errorResponse)(error, res);
    }
    finally {
        yield client.close();
    }
}));
router.put("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const collection = yield (0, functions_1.loadCollection)(client, "products");
        const updateProduct = req.body;
        const result = yield collection.updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: updateProduct });
        if (result.matchedCount === 0) {
            res.status(404).json({ message: "Product not found" });
        }
        else {
            res.status(200).json(Object.assign({}, result));
        }
    }
    catch (error) {
        (0, functions_1.errorResponse)(error, res);
    }
    finally {
        yield client.close();
    }
}));
router.delete("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const collection = yield (0, functions_1.loadCollection)(client, "products");
        const result = yield collection.deleteOne({
            _id: new mongodb_1.ObjectId(req.params.id),
        });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "No Product found with that ID" });
        }
        else {
            res.status(204).json({ message: "Product Deleted" });
        }
    }
    catch (error) {
        (0, functions_1.errorResponse)(error, res);
    }
    finally {
        yield client.close();
    }
}));
exports.default = router;
