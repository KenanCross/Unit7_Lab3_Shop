import { MongoClient } from "mongodb";
import { Product } from "../models/Product";
import { User } from "../models/User";

export const errorResponse = (err: any, res: any) => {
	console.error("FAIL", err);
	res.status(500).json({ message: "Internal Server Error" });
};

export const loadCollection = async (client: MongoClient, collectionName: string) => {
	//access the MongoDB Collection and load specified collection name
	if (collectionName === 'product') {
		return client.db().collection<Product>(collectionName);
	} else {
		return client.db().collection<User>(collectionName);
	}
	
};
