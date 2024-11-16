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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCollection = exports.errorResponse = void 0;
const errorResponse = (err, res) => {
    console.error("FAIL", err);
    res.status(500).json({ message: "Internal Server Error" });
};
exports.errorResponse = errorResponse;
const loadCollection = (client, collectionName) => __awaiter(void 0, void 0, void 0, function* () {
    //access the MongoDB Collection and load specified collection name
    if (collectionName === 'product') {
        return client.db().collection(collectionName);
    }
    else {
        return client.db().collection(collectionName);
    }
});
exports.loadCollection = loadCollection;
